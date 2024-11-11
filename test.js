const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");

// Load environment variables
dotenv.config();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
const port = 4000;

// Middleware setup
app.use(cors());
app.use(express.json());

app.get("/test", async (req, res) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      max_tokens: 1,
      messages: [
        { role: "system", content: "You are a joe and the juice assistant who can only use 1 word." },
        {
          role: "user",
          content: "What is the most popular juice?",
        },
      ],
    });

    res.json(completion.choices[0].message);
  } catch (error) {
    console.error("Error creating completion:", error);
    res.status(500).json({ error: "Failed to generate completion" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
