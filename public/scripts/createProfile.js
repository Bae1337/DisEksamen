async function CreateProfile() {
    let username = document.getElementById('username').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    try {
        let response = await fetch('/customer/createprofile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, email }),
        });

        if (response.ok) {
            let data = await response.json();
            document.getElementById('message').innerText = data.message;
        }

    } catch (error) {
        console.error('Error:', error);
    }
    
}