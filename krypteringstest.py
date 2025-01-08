import time
from cryptography.hazmat.primitives.asymmetric import rsa, padding  # Importér RSA og padding-metoder til asymmetrisk kryptering
from cryptography.hazmat.primitives import hashes  # Importér hashing-funktioner
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes  # Importér symmetrisk kryptering (AES)
from cryptography.hazmat.backends import default_backend  # Backend til kryptografiske operationer
import os  # Modul til at generere tilfældige værdier

# --- Generering af RSA-nøgler ---
# RSA bruger en privat nøgle til dekryptering og en offentlig nøgle til kryptering
private_key = rsa.generate_private_key(
    public_exponent=65537,  # Standard offentligt eksponentvalg for RSA
    key_size=2048,  # Størrelsen af RSA-nøglen i bits (2048 anbefales som sikker)
    backend=default_backend()  # Brug standard backend til at håndtere kryptografiske operationer
)
public_key = private_key.public_key()  # Generér den tilhørende offentlige nøgle

# --- Generering af symmetrisk nøgle (AES) ---
# En tilfældig symmetrisk nøgle (256 bits) genereres til brug med AES-algoritmen
symmetric_key = os.urandom(32)  # Generér 256-bit nøgle (32 bytes)
iv = os.urandom(16)  # Initialiseringsvektor (16 bytes for AES)

# --- Data, der skal krypteres ---
# Opret nogle data, der skal bruges til krypteringstesten
data = b"This is a test message to compare symmetric and asymmetric encryption." * 10  # Gentag besked for at få større data

# --- Forberedelse til asymmetrisk kryptering ---
# RSA kan ikke direkte kryptere store mængder data, så en hash af dataene bruges i stedet
data_hash = hashes.Hash(hashes.SHA256(), backend=default_backend())  # Brug SHA-256 som hash-algoritme
data_hash.update(data)  # Beregn hash af data
data_digest = data_hash.finalize()  # Færdiggør hash og gem det som en digest (fast størrelse)

# --- Asymmetrisk krypteringstest ---
# Mål tiden for kryptering med den asymmetriske metode
start_asymmetric_encrypt = time.time()  # Start tidtagning
asymmetric_encrypted = public_key.encrypt(
    data_digest,  # Krypter hash-digesten
    padding.PKCS1v15()  # Brug PKCS#1 v1.5 padding
)
end_asymmetric_encrypt = time.time()  # Stop tidtagning

# Mål tiden for dekryptering med den asymmetriske metode
start_asymmetric_decrypt = time.time()  # Start tidtagning
asymmetric_decrypted_digest = private_key.decrypt(
    asymmetric_encrypted,  # Dekrypter den krypterede hash
    padding.PKCS1v15()  # Brug samme padding som under kryptering
)
end_asymmetric_decrypt = time.time()  # Stop tidtagning

# --- Symmetrisk krypteringstest ---
# Opsæt AES-kryptering i CFB-mode (Cipher Feedback Mode)
cipher = Cipher(algorithms.AES(symmetric_key), modes.CFB(iv), backend=default_backend())  # Opret AES-cipher
encryptor = cipher.encryptor()  # Opret en krypteringsobjekt
decryptor = cipher.decryptor()  # Opret en dekrypteringsobjekt

# Mål tiden for kryptering med den symmetriske metode
start_symmetric_encrypt = time.time()  # Start tidtagning
symmetric_encrypted = encryptor.update(data) + encryptor.finalize()  # Krypter data
end_symmetric_encrypt = time.time()  # Stop tidtagning

# Mål tiden for dekryptering med den symmetriske metode
start_symmetric_decrypt = time.time()  # Start tidtagning
symmetric_decrypted = decryptor.update(symmetric_encrypted) + decryptor.finalize()  # Dekrypter data
end_symmetric_decrypt = time.time()  # Stop tidtagning

# --- Verificering af dekryptering ---
# Sørg for, at de dekrypterede data matcher de originale
assert data_digest == asymmetric_decrypted_digest, "Asymmetrisk dekryptering fejlede!"  # Kontrollér asymmetrisk dekryptering
assert data == symmetric_decrypted, "Symmetrisk dekryptering fejlede!"  # Kontrollér symmetrisk dekryptering

# --- Udsend resultater ---
# Udskriv tid for kryptering og dekryptering for begge metoder
print("--- Resultater ---")
print(f"Asymmetrisk krypteringstid: {end_asymmetric_encrypt - start_asymmetric_encrypt:.6f} sekunder")
print(f"Asymmetrisk dekrypteringstid: {end_asymmetric_decrypt - start_asymmetric_decrypt:.6f} sekunder")
print(f"Symmetrisk krypteringstid: {end_symmetric_encrypt - start_symmetric_encrypt:.6f} sekunder")
print(f"Symmetrisk dekrypteringstid: {end_symmetric_decrypt - start_symmetric_decrypt:.6f} sekunder")