import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 Route API pour discuter avec OpenAI
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Tu es Aura AI, un coach de dating bienveillant et amusant 💖." },
          { role: "user", content: message },
        ],
      }),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Erreur OpenAI:", error);
    res.status(500).json({ error: "Erreur lors de la communication avec Aura AI" });
  }
});

// 🔹 Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Serveur Aura AI en ligne sur http://localhost:${PORT}`));
