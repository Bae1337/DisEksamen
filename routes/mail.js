// Importér nødvendige moduler
const express = require("express");
const mailRoutes = express.Router(); // Opret en router til e-mail-relaterede ruter
const nodemailer = require("nodemailer"); // Nodemailer til at sende e-mails

// Brug JSON-parser middleware til at håndtere JSON-forespørgsler
mailRoutes.use(express.json());

// Konfiguration af Nodemailer med Gmail som e-mail-tjeneste
let transporter = nodemailer.createTransport({
    service: "gmail", // Angiv e-mail-tjenesten som Gmail
    auth: {
        user: "bigjoeservicemail@gmail.com", // Afsenderens e-mailadresse
        pass: "byfdqszyoskzngxj", // Adgangskode til afsenderens e-mail (bemærk: det er en sikkerhedsrisiko at have dette i koden)
    },
});

// POST-endepunkt til at sende en e-mail
mailRoutes.post("/sendmail", (req, res) => {
    try {
        // Send en e-mail med Nodemailer
        let info = transporter.sendMail({
            from: "Joe <bigjoeservicemail@gmail.com>", // Afsenderens navn og e-mailadresse
            to: req.body.email, // Modtagerens e-mailadresse fra forespørgslen
            subject: "Welcome to Joe & The Juice", // Emne for e-mailen
            text: "Welcome to Joe & The Juice! We are excited to have you as a customer. We hope you enjoy our products and services.", // E-mailens tekstindhold
        });

        console.log("Email sent:", info); // Log besked, når e-mailen er sendt
        res.status(200).json({ message: "Email sent" }); // Returnér succesmeddelelse
    } catch (error) {
        console.error("Error sending email:", error); // Log fejl, hvis e-mailen ikke kan sendes
        return res.status(500).json({ error: "Failed to send email" }); // Returnér fejlmeddelelse
    }
});

// Eksportér routeren, så den kan bruges i andre filer
module.exports = mailRoutes;
