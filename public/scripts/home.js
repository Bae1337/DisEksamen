function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const user = {
    username,
    password,
  };

  axios
    .post("/customer/login", user)
    .then(function (response) {
      location.href = "/Menu";
    })
    .catch(function (error) {
      console.log(error);
      document.getElementById("message").innerText = "Forkert brugernavn eller adgangskode";
    });
}