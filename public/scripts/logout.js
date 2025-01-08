// Kald logout-funktionen for at logge brugeren ud
logout();

function logout() {
    // Sæt "userAuth"-cookien til en tom værdi og angiv en udløbsdato i fortiden for at slette den
    document.cookie = "userAuth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Fjern kurvens indhold fra localStorage
    localStorage.removeItem('cart');

    // Vis en besked til brugeren om, at de er blevet logget ud
    alert("Du er nu logget ud");

    // Omdiriger brugeren til forsiden
    window.location.href = "/";
}
