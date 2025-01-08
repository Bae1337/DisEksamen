// Funktion til at håndtere login-processen
function login() {
  const username = document.getElementById("username").value; // Hent brugernavn fra inputfeltet
  const password = document.getElementById("password").value; // Hent adgangskode fra inputfeltet

  // Opret et brugerobjekt med brugernavn og adgangskode
  const user = {
    username,
    password,
  };

  // Send en POST-forespørgsel til serveren for at logge brugeren ind
  axios
    .post("/customer/login", user) // Brug Axios til at sende login-oplysningerne
    .then(function (response) {
      location.href = "/Menu"; // Omdiriger brugeren til menu-siden ved succesfuldt login
    })
    .catch(function (error) {
      console.log(error); // Log fejlen i konsollen
      document.getElementById("message").innerText = "Forkert brugernavn eller adgangskode"; // Vis fejlbesked til brugeren
    });
}
