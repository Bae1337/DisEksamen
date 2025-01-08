// Funktion til at hente værdien af en specifik cookie baseret på dens navn
function getCookie(name) {
  const value = `; ${document.cookie}`; // Tilføj et semikolon og et mellemrum foran alle cookies for nemmere parsing
  const parts = value.split(`; ${name}=`); // Split cookies op efter det ønskede navn
  if (parts.length === 2) return parts.pop().split(";").shift(); // Returnér værdien af cookien, hvis den findes
}

// Hent værdien af "userAuth"-cookien og gem den i variablen `username`
let username = getCookie("userAuth");

// Hvis "userAuth"-cookien ikke findes, omdiriger brugeren til forsiden
if (!username) {
  location.href = "/"; // Omdiriger til root-URL'en
}

// Asynkron funktion til at sende et spørgsmål til "Big Joe" og vise svaret
async function spørgBigJoe() {
  let spørgsmål = document.getElementById('spørgInput').value; // Hent brugerens spørgsmål fra inputfeltet

  try {
    // Send spørgsmålet til serveren via en POST-forespørgsel
    let response = await fetch('/askJoe/AskJoe', {
      method: 'POST', // HTTP-metode
      headers: {
        'Content-Type': 'application/json', // Angiv indholdstypen som JSON
      },
      body: JSON.stringify({ message: spørgsmål }), // Send spørgsmålet i JSON-format
    });

    // Hvis serveren svarer korrekt
    if (response.ok) {
      const data = await response.json(); // Parse svaret som JSON
      document.getElementById('svar').innerHTML = data.content; // Vis serverens svar i elementet med id "svar"
    }

  } catch (error) {
    console.error('Fejl:', error); // Log fejl, hvis der opstår en
  }
}
