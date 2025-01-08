// Importér nødvendige moduler
const express = require("express");
const customerRoutes = express.Router(); // Opret en router til kunde-relaterede ruter
const cookieParser = require("cookie-parser"); // Middleware til at parse cookies
const db = require("../db"); // Forbindelse til databasen
const bcrypt = require("bcrypt"); // Modul til kryptering af adgangskoder
const jwt = require("jsonwebtoken"); // Modul til generering og validering af JSON Web Tokens (JWT)

// Brug cookie-parser middleware
customerRoutes.use(cookieParser());

// GET-request for at hente alle kunder fra databasen (ikke i brug)
customerRoutes.get("/", (req, res) => {
  let query = `SELECT * FROM customers`; // SQL-spørgsmål til at hente alle kunder

  db.all(query, (err, customers) => {
    if (err) {
      return res.status(500).json({ error: err.message }); // Returnér fejlmeddelelse ved databasefejl
    }
    res.send(customers); // Returnér listen af kunder
  });
});

// POST-request for at oprette en ny bruger i databasen
customerRoutes.post("/createprofile", (req, res) => {
  const { username, password, email } = req.body; // Hent data fra forespørgslens body

  // Krypter adgangskoden
  const cryptedPassword = bcrypt.hashSync(password, 10);

  // Tjek først, om brugernavn eller e-mail allerede findes
  const checkQuery = `SELECT * FROM customers WHERE username = ? OR email = ?`;

  db.get(checkQuery, [username, email], (err, row) => {
    if (err) {
      return res.status(500).json({ error: "Databasefejl. Prøv igen senere." });
    }

    if (row) {
      // Hvis brugernavn eller e-mail allerede findes
      return res.status(400).json({ error: "Brugernavn eller email er allerede i brug." });
    }

    // Hvis brugernavn og e-mail ikke findes, indsæt data i databasen
    const insertQuery = `INSERT INTO customers (username, password, email) VALUES (?, ?, ?)`;

    db.run(insertQuery, [username, cryptedPassword, email], (err) => {
      if (err) {
        return res.status(500).json({ error: "Kunne ikke oprette bruger. Prøv igen senere." });
      }
      res.status(201).json({ message: "Bruger oprettet" }); // Returnér succesmeddelelse
    });
  });
});

// PUT-request for at opdatere en eksisterende bruger (ikke i brug)
customerRoutes.put("/:username", (req, res) => {
  let { password, email } = req.body; // Hent opdaterede data fra forespørgslens body
  let { username } = req.params; // Hent brugernavnet fra URL-parametre

  let query = `UPDATE customers SET password = ?, email = ? WHERE username = ?`;

  db.run(query, [password, email, username], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message }); // Returnér fejlmeddelelse ved databasefejl
    }
    res.send("Bruger opdateret"); // Returnér succesmeddelelse
  });
});

// DELETE-request for at slette en bruger baseret på brugernavn (ikke i brug)
customerRoutes.delete("/:username", (req, res) => {
  let { username } = req.params; // Hent brugernavnet fra URL-parametre

  let query = `DELETE FROM customers WHERE username = ?`;

  db.run(query, username, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message }); // Returnér fejlmeddelelse ved databasefejl
    }
    res.send("Bruger slettet"); // Returnér succesmeddelelse
  });
});

// POST-request for at logge en bruger ind og sætte en cookie
customerRoutes.post("/login", (req, res) => {
  const { username, password } = req.body; // Hent brugernavn og adgangskode fra forespørgslens body
  const query = `SELECT * FROM customers WHERE username = ?`;

  db.get(query, [username], (err, customer) => {
    if (err) {
      return res.status(500).json({ error: err.message }); // Returnér fejlmeddelelse ved databasefejl
    }
    if (customer) {
      // Sammenlign den indtastede adgangskode med den krypterede adgangskode i databasen
      bcrypt.compare(password, customer.password, (err, result) => {
        if (err) {
          return res.status(500).json({ error: err.message }); // Returnér fejlmeddelelse ved krypteringsfejl
        }
        if (result) {
          // Hvis adgangskoden matcher, sæt en cookie og log brugeren ind
          res
            .cookie("userAuth", username, { maxAge: 3600000 }) // Sæt cookie med en levetid på 1 time
            .status(200)
            .send({ message: "Du er blevet logget ind" }); // Returnér succesmeddelelse
        } else {
          res.status(401).send({ message: "Forkert brugernavn eller adgangskode" }); // Returnér fejlmeddelelse
        }
      });
    } else {
      res.status(401).send({ message: "Forkert brugernavn eller adgangskode" }); // Returnér fejlmeddelelse, hvis brugeren ikke findes
    }
  });
});

// Eksportér routeren, så den kan bruges i andre filer
module.exports = customerRoutes;
