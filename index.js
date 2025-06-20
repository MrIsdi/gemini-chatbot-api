import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const port = process.env.PORT || 3000;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

app.post("/api/chat", async (req, res)=>{
    const userMessage = req.body.message;

    if(!userMessage) return res.status(400).json({ message: "No message found"});

    try {
        const result = await model.generateContent(userMessage)
        const response = await result.response
        const text = response.text()
        res.status(200).json({ reply: text });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
})

app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`);
});