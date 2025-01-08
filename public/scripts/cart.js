// Funktion til at hente værdien af en specifik cookie baseret på dens navn
function getCookie(name) {
    const value = `; ${document.cookie}`; // Tilføj et semikolon og mellemrum foran cookies for nemmere parsing
    console.log(document.cookie); // Log alle cookies i konsollen
    const parts = value.split(`; ${name}=`); // Split cookies op efter det ønskede navn
    console.log(value); // Log den formaterede cookie-streng
    console.log(parts); // Log de opdelte dele for debugging
    if (parts.length === 2) return parts.pop().split(";").shift(); // Returnér værdien af cookien, hvis den findes
}

// Hent værdien af "userAuth"-cookien og gem den i variablen `username`
let username = getCookie("userAuth");

// Hvis "userAuth"-cookien ikke findes, omdiriger brugeren til forsiden
if (!username) {
    location.href = "/"; // Omdiriger til root-URL'en
}

// Funktion til at vise indholdet af kurven
visKurv();

function visKurv() {
    let kurv = JSON.parse(localStorage.getItem('cart')) || []; // Hent kurvens indhold fra localStorage eller brug en tom liste
    let total = 0; // Start totalen på 0
    let kurvDiv = document.getElementById('kurv'); // Find elementet til at vise kurven
    kurvDiv.innerHTML = ''; // Ryd kurven inden visning

    // Iterér gennem hver vare i kurven
    for (let vare of kurv) {
        let vareDiv = document.createElement('div'); // Opret et div-element til varen
        vareDiv.classList.add('product-item-cart'); // Tilføj en CSS-klasse

        let vareDetailsDiv = document.createElement('div'); // Opret et div-element til vareoplysninger
        vareDetailsDiv.classList.add('product-details'); // Tilføj en CSS-klasse
        vareDetailsDiv.innerHTML = `
            <span>${vare.productName}</span>
            <span>${vare.price} kr</span>
        `; // Vis varenavn og pris

        let removeButton = document.createElement('button'); // Opret en knap til at fjerne varen
        removeButton.innerHTML = 'Fjern'; // Tekst på knappen
        removeButton.addEventListener('click', function () {
            fjernFraKurv(vare.productName); // Fjern varen fra kurven, når knappen klikkes
        });

        vareDiv.appendChild(vareDetailsDiv); // Tilføj vareoplysninger til vare-div'en
        vareDiv.appendChild(removeButton); // Tilføj knappen til vare-div'en
        kurvDiv.appendChild(vareDiv); // Tilføj vare-div'en til kurv-div'en

        total += vare.price; // Tilføj prisen til totalen
    }

    // Opret og vis totalprisen
    let totalDiv = document.createElement('div');
    totalDiv.classList.add('total-container'); // Tilføj en CSS-klasse
    totalDiv.innerHTML = `<span>Total: </span> <span>${total} kr</span>`;
    kurvDiv.appendChild(totalDiv); // Tilføj totalen til kurv-div'en
}

// Funktion til at fjerne en vare fra kurven baseret på varenavn
function fjernFraKurv(productName) {
    let kurv = JSON.parse(localStorage.getItem('cart')) || []; // Hent kurvens indhold fra localStorage eller brug en tom liste
    kurv = kurv.filter(vare => vare.productName !== productName); // Filtrér varen ud af kurven
    localStorage.setItem('cart', JSON.stringify(kurv)); // Opdater kurven i localStorage
    visKurv(); // Opdater visningen af kurven
}

// Asynkron funktion til at gennemføre checkout-processen
async function checkUd() {
    let telefonnummer = document.getElementById('telefonnummer').value; // Hent brugerens telefonnummer fra inputfeltet

    try {
        // Send telefonnummeret til serveren via en POST-forespørgsel
        let response = await fetch('/product/checkUd', {
            method: 'POST', // HTTP-metode
            headers: {
                'Content-Type': 'application/json' // Angiv indholdstypen som JSON
            },
            body: JSON.stringify({ phone: telefonnummer }) // Send telefonnummeret i JSON-format
        });

        if (response.ok) {
            alert('Tak for din bestilling'); // Giv brugeren besked om, at bestillingen er gennemført
            localStorage.removeItem('cart'); // Ryd kurven i localStorage
            telefonnummer.value = ''; // Ryd inputfeltet
            visKurv(); // Opdater visningen af kurven
        } else {
            alert('Der skete en fejl'); // Giv besked om en fejl, hvis serveren ikke svarer korrekt
        }

    } catch (error) {
        console.error('Der skete en fejl', error); // Log fejl, hvis der opstår en
    }
}
