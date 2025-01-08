// Importér nødvendige moduler
const express = require("express");
const askJoeRoutes = express.Router(); // Opret en router til AskJoe-endepunktet
const cookieParser = require("cookie-parser"); // Middleware til at parse cookies
const dotenv = require("dotenv"); // For at håndtere miljøvariabler
const OpenAI = require("openai"); // OpenAI-bibliotek til API-kommunikation
dotenv.config(); // Indlæs miljøvariabler fra en .env-fil

// Opret en instans af OpenAI med API-nøglen fra miljøvariabler
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Hent API-nøglen fra miljøvariabler
});

// Brug cookie-parser som middleware
askJoeRoutes.use(cookieParser());

// Definér POST-endepunktet for /AskJoe
askJoeRoutes.post("/AskJoe", async (req, res) => {
  let message = req.body.message; // Hent brugerens besked fra forespørgslens body
  try {
    // Send en forespørgsel til OpenAI API for at generere et svar
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125", // Brug specificeret model
      max_tokens: 100, // Maksimalt antal tokens i svaret
      messages: [
        {
          role: "system",
          content: "You are a helpful Joe and the Juice assistant who can only use 1 sentence. Your expertise is solely on Joe and the Juice and related topics, hence you shouldn't answer unrelated questions.",
        }, // Systembesked for at definere assistentens rolle
        { role: "user", content: message }, // Brugerens besked
      ],
    });

    // Send det genererede svar tilbage som JSON
    return res.json(completion.choices[0].message);
  } catch (error) {
    console.error("Error creating completion:", error); // Log fejl til konsollen
    return res.status(500).json({ error: "Failed to generate completion" }); // Send en fejlbesked tilbage
  }
});

// Eksportér routeren, så den kan bruges i andre filer
module.exports = askJoeRoutes;
