async function CreateProfile() {
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (username === '' || email === '' || password === '') {
        document.getElementById('message').innerHTML = 'Alle felter skal udfyldes.';
        return;
    }


    try {
        // Send forespørgsel for at oprette en profil
        const profileResponse = await fetch('/customer/createprofile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, email }),
        });

        if (!profileResponse.ok) {
            const errorData = await profileResponse.json();
            document.getElementById('message').innerHTML = 
                `Fejl: ${errorData.error || 'Kunne ikke oprette profil.'}`;
            return;
        }

        const profileData = await profileResponse.json();
        console.log('Profile created:', profileData.message);

        // Send forespørgsel for at sende en e-mail
        const emailResponse = await fetch('/mail/sendmail', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        if (!emailResponse.ok) {
            const emailError = await emailResponse.json();
            document.getElementById('message').innerHTML = 
                'Profilen blev oprettet, men der opstod en fejl ved afsendelse af e-mail.';
            console.error('Email error:', emailError.error || 'Ukendt fejl');
            return;
        }

        const emailData = await emailResponse.json();
        console.log('Email sent:', emailData.message);

        // Viser succesbesked
        document.getElementById('message').innerHTML = `${profileData.message}. Klik <a href="/">her</a> for at logge ind.`;

    } catch (error) {
        console.error('Unexpected error:', error);
        document.getElementById('message').innerHTML = 'Der opstod en uventet fejl. Prøv igen senere.';
    }
}
