const express = require("express");
const askJoeRoutes = express.Router();
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const OpenAI = require("openai");
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

askJoeRoutes.use(cookieParser());

askJoeRoutes.post("/AskJoe", async (req, res) => {
  let message = req.body.message;
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      max_tokens: 10,
      messages: [
        { role: "system", content: "You are a joe and the juice assistant who can only use 1 word." },
        { role: "user", content: message },
      ],
    });

    return res.json(completion.choices[0].message);
  } catch (error) {
    console.error("Error creating completion:", error);
    return res.status(500).json({ error: "Failed to generate completion" });
  }
});

module.exports = askJoeRoutes;
