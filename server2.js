// Importér nødvendige moduler
const express = require("express"); // Express til at oprette serveren
const cors = require("cors"); // CORS-middleware til håndtering af cross-origin-anmodninger
const path = require("path"); // Path-modul til arbejde med fil- og mappestier

// Initialisér Express-applikationen
const app = express();

// Importér ruter fra andre filer
const customerRoute = require("./routes/customer"); // Kunde-relaterede ruter
const productRoute = require("./routes/product"); // Produkt-relaterede ruter
const askJoeRoute = require("./routes/askJoe"); // "Ask Joe"-relaterede ruter
const mailRoute = require("./routes/mail"); // Mail-relaterede ruter

// Middleware
app.use(cors()); // Aktiver CORS for at tillade cross-origin-forespørgsler
app.use(express.json()); // Middleware til at parse JSON i forespørgsler
app.use(express.static(path.join(__dirname, "./public"))); // Gør statiske filer i "./public"-mappen tilgængelige

// Ruter for forskellige sider i applikationen
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/pages/home.html")); // Returnér startside (home.html)
});

app.get("/menu", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/pages/menu.html")); // Returnér menu-side (menu.html)
});

app.get("/askJoe", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/pages/askJoe.html")); // Returnér "Ask Joe"-side (askJoe.html)
});

app.get("/CreateProfile", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/pages/createProfile.html")); // Returnér side til oprettelse af profil (createProfile.html)
});

app.get("/kurv", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/pages/cart.html")); // Returnér kurv-side (cart.html)
});

app.get("/logout", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/pages/logout.html")); // Returnér logout-side (logout.html)
});

// Brug ruter fra andre moduler
app.use("/customer", customerRoute); // Kunde-relaterede API-ruter
app.use("/product", productRoute); // Produkt-relaterede API-ruter
app.use("/askJoe", askJoeRoute); // "Ask Joe"-relaterede API-ruter
app.use("/mail", mailRoute); // Mail-relaterede API-ruter

// Start serveren på port 3002
app.listen(3002, () => {
  console.log("Server kører på port 3002"); // Log besked for at indikere, at serveren er startet
});