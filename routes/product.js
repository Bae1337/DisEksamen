// Importér nødvendige moduler
const express = require("express");
const productRoutes = express.Router(); // Opret en router til produkt-relaterede ruter
const cookieParser = require("cookie-parser"); // Middleware til at parse cookies
productRoutes.use(cookieParser());
const db = require("../db"); // Forbindelse til databasen
const twilio = require("twilio"); // Twilio til SMS-håndtering
const dotenv = require("dotenv"); // Modul til miljøvariabler
dotenv.config(); // Indlæs miljøvariabler fra en .env-fil

// Hent Twilio-kontooplysninger fra miljøvariabler
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

// Middleware til at autentificere brugeren baseret på en cookie
function authenticateUser(req, res, next) {
    const authCookie = req.cookies.userAuth; // Hent "userAuth"-cookien

    if (!authCookie) {
        return res.status(401).send("Ingen authentication cookie."); // Returnér fejl, hvis cookien mangler
    }

    const query = "SELECT * FROM customers WHERE username = ?"; // SQL-spørgsmål til at finde brugeren i databasen
    db.get(query, [authCookie], (err, customer) => {
        if (err) {
            return res.status(500).send("Database error."); // Returnér fejl ved databaseproblemer
        }
        if (!customer) {
            return res.status(401).send("Ugyldig cookie."); // Returnér fejl, hvis brugeren ikke findes
        }

        next(); // Gå videre til næste middleware eller route-handler
    });
}

// Hent alle produkter fra databasen
productRoutes.get('/getProducts', async (req, res) => {
    try {
        db.all("SELECT productName, imgsrc, price, type FROM products", [], (err, rows) => {
            if (err) {
                return res.status(500).json({ message: "Error fetching products" }); // Returnér fejl, hvis data ikke kan hentes
            }
            res.status(200).json(rows); // Returnér produktlisten som JSON
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching products" }); // Returnér fejl ved undtagelser
    }
});

// Hent detaljer for et specifikt produkt baseret på navn
productRoutes.post('/getProduct/productName', authenticateUser, (req, res) => {
    const productName = req.body.productName; // Hent produktnavnet fra forespørgslen

    db.get("SELECT * FROM products WHERE productName like ?", [productName], (err, product) => {
        if (err) {
            return res.status(500).json({ message: "Error fetching product" }); // Returnér fejl, hvis data ikke kan hentes
        }
        res.status(200).json(product); // Returnér produktdata som JSON
    });
});

// Initialisér Twilio-klienten med konto-ID og autentificeringstoken
const client = require("twilio")(accountSid, authToken);

// Send en SMS-besked ved checkout
productRoutes.post('/checkUd', authenticateUser, async (req, res) => {
    const phoneNumber = req.body.phone; // Hent telefonnummeret fra forespørgslen
    try {
        const message = await client.messages.create({
            body: "Tak for din bestilling. Din ordre er klar til afhentning om 5 minutter. Foretag venligst betaling i butikken. \n\nJOE & THE JUICE", // Beskedtekst
            from: "+14055462497", // Afsenderens nummer
            to: "+45" + phoneNumber, // Modtagerens nummer (med dansk landekode)
        });
        res.status(200).send("Besked sendt til telefonnummeret +45 " + phoneNumber); // Returnér succesmeddelelse
    } catch (error) {
        console.error("Fejl i håndtering af SMS: ", error); // Log fejl
        res.status(500).send("Der skete en fejl i håndteringen af SMS"); // Returnér fejlmeddelelse
    }
});

// Eksportér routeren, så den kan bruges i andre filer
module.exports = productRoutes;
