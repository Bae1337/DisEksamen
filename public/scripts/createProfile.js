// Asynkron funktion til at oprette en ny profil
async function CreateProfile() {
    const username = document.getElementById('username').value; // Hent brugernavn fra inputfeltet
    const email = document.getElementById('email').value; // Hent e-mail fra inputfeltet
    const password = document.getElementById('password').value; // Hent adgangskode fra inputfeltet

    // Tjek om alle felter er udfyldt
    if (username === '' || email === '' || password === '') {
        document.getElementById('message').innerHTML = 'Alle felter skal udfyldes.'; // Vis fejlbesked
        return; // Stop funktionen, hvis et eller flere felter er tomme
    }

    try {
        // Send en POST-forespørgsel til serveren for at oprette en ny profil
        const profileResponse = await fetch('/customer/createprofile', {
            method: 'POST', // HTTP-metode
            headers: { 'Content-Type': 'application/json' }, // Angiv indholdstypen som JSON
            body: JSON.stringify({ username, password, email }), // Send brugernavn, adgangskode og e-mail som JSON
        });

        // Hvis oprettelsen mislykkes
        if (!profileResponse.ok) {
            const errorData = await profileResponse.json(); // Hent fejlbeskeden fra serveren
            document.getElementById('message').innerHTML = 
                `Fejl: ${errorData.error || 'Kunne ikke oprette profil.'}`; // Vis en fejlbesked
            return; // Stop funktionen
        }

        const profileData = await profileResponse.json(); // Hent serverens svar ved succesfuld profiloprettelse
        console.log('Profile created:', profileData.message); // Log succesbeskeden

        // Send en POST-forespørgsel for at sende en e-mail til brugeren
        const emailResponse = await fetch('/mail/sendmail', {
            method: 'POST', // HTTP-metode
            headers: { 'Content-Type': 'application/json' }, // Angiv indholdstypen som JSON
            body: JSON.stringify({ email }), // Send e-mailadressen som JSON
        });

        // Hvis e-mailen ikke kan sendes
        if (!emailResponse.ok) {
            const emailError = await emailResponse.json(); // Hent fejlbeskeden fra serveren
            document.getElementById('message').innerHTML = 
                'Profilen blev oprettet, men der opstod en fejl ved afsendelse af e-mail.'; // Vis fejlbesked om e-mailen
            console.error('Email error:', emailError.error || 'Ukendt fejl'); // Log fejlen
            return; // Stop funktionen
        }

        const emailData = await emailResponse.json(); // Hent serverens svar ved succesfuld e-mailafsendelse
        console.log('Email sent:', emailData.message); // Log succesbeskeden for e-mailen

        // Vis succesbesked med link til login
        document.getElementById('message').innerHTML = 
            `${profileData.message}. Klik <a href="/">her</a> for at logge ind.`;

    } catch (error) {
        console.error('Unexpected error:', error); // Log uventede fejl
        document.getElementById('message').innerHTML = 'Der opstod en uventet fejl. Prøv igen senere.'; // Vis fejlbesked til brugeren
    }
}

