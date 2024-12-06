const express = require("express");
const mailRoutes = express.Router();

const nodemailer = require("nodemailer");

mailRoutes.use(express.json());

let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "bigjoeservicemail@gmail.com",
        pass: "byfdqszyoskzngxj",
    },
});


mailRoutes.post("/sendmail", (req, res) => {
    try {
        let info = transporter.sendMail({
            from: "Joe <bigjoeservicemail@gmail.com>",
            to: req.body.email,
            subject: "Welcome to Joe & The Juice",
            text: "Welcome to Joe & The Juice! We are excited to have you as a customer. We hope you enjoy our products and services.",
        });
        
        console.log("Email sent:", info);
        res.status(200).json({ message: "Email sent" });
    }
    catch(error){
        console.error("Error sending email:", error);
        return res.status(500).json({ error: "Failed to send email" });
    }
});

module.exports = mailRoutes;