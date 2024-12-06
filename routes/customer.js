const express = require("express");
const customerRoutes = express.Router();
const cookieParser = require("cookie-parser");
const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

customerRoutes.use(cookieParser());



// Opret en get request til customers, der hiver alt ud fra SQL db'en igennem customer tabellen:

customerRoutes.get("/", (req, res) => {
  let query = `SELECT * FROM customers`;

  db.all(query, (err, customers) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.send(customers);
  });

});


// opret en post request, der tilføjer en bruger i db'en i customer tabellen. 
customerRoutes.post("/createprofile", (req, res) => {
  const { username, password, email } = req.body;

  // Krypter password
  const cryptedPassword = bcrypt.hashSync(password, 10);

  // Først tjek om brugernavn eller email allerede findes
  const checkQuery = `SELECT * FROM customers WHERE username = ? OR email = ?`;

  db.get(checkQuery, [username, email], (err, row) => {
    if (err) {
      return res.status(500).json({ error: "Databasefejl. Prøv igen senere." });
    }

    if (row) {
      // Hvis brugernavn eller email allerede findes
      return res.status(400).json({ error: "Brugernavn eller email er allerede i brug." });
    }

    // Hvis brugernavn og email ikke findes, indsæt i databasen
    const insertQuery = `INSERT INTO customers (username, password, email) VALUES (?, ?, ?)`;

    db.run(insertQuery, [username, cryptedPassword, email], (err) => {
      if (err) {
        return res.status(500).json({ error: "Kunne ikke oprette bruger. Prøv igen senere." });
      }
      res.status(201).json({ message: "Bruger oprettet" });
    });
  });
});



// Opret PUT request til at opdatere en eksisterende bruger i customer-tabellen:

customerRoutes.put("/:username", (req, res) => {
  let { password, email } = req.body;
  let { username } = req.params;

  let query = `UPDATE customers SET password = ?, email = ? WHERE username = ?`;

  db.run(query, [password, email, username], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.send("Bruger opdateret");
  });

});

// Opret DELETE request til at slette en kunde fra customer-tabellen baseret på brugernavn:

customerRoutes.delete("/:username", (req, res) => {
  let { username } = req.params;

  let query = `DELETE FROM customers WHERE username = ?`;

  db.run(query, username, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.send("Bruger slettet");
  });

});

// Cookie implementation

customerRoutes.post("/login", (req, res) => {
  const { username, password } = req.body;
  const query = `SELECT * FROM customers WHERE username = ?`;

  db.get(query, [username], (err, customer) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (customer) {
      bcrypt.compare(password, customer.password, (err, result) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        if (result) {
          res
            .cookie("userAuth", username, { maxAge: 3600000 })
            .status(200)
            .send({ message: "Du er blevet logget ind" });
        } else {
          res.status(401).send({ message: "Forkert brugernavn eller adgangskode" });
        }
      });
    } else {
      res.status(401).send({ message: "Forkert brugernavn eller adgangskode" });
    }
  });
});

// Protected route

customerRoutes.get("/protected", (req, res) => {
  const authCookie = req.cookies.userAuth;

  if (!authCookie) {
    return res.status(401).send("Ingen authentication cookie.");
  }

  const query = `SELECT * FROM customers WHERE username = ?`;

  db.get(query, authCookie, (err, customer) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!customer) {
      return res.status(401).send("Ugyldig cookie.");
    }
    res.send("Hej.");
  });
});

module.exports = customerRoutes;