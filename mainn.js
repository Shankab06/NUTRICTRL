const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.use(express.static("public")); // Serve frontend files from "public" folder

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

app.post("/analyze", async (req, res) => {
    try {
        const { ingredients } = req.body;
        if (!ingredients) return res.status(400).json({ error: "No ingredients provided" });

        const prompt = `Analyze these food ingredients: ${ingredients}. Classify them strictly as 'Good', 'Neutral', or 'Bad' for health. Reply only with one of these words.`;
        
        const result = await model.generateContent(prompt);
        const analysis = await result.response.text();

        // Extract classification and send it
        if (["Good", "Neutral", "Bad"].includes(analysis.trim())) {
            res.json({ result: analysis.trim() });
        } else {
            res.json({ result: "Neutral" }); // Default fallback
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong." });
    }
});

// Start Server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
