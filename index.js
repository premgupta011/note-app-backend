import express from "express";
import dotenv from "dotenv";
import connectdb from "./config/db.js";
import auth from "./routes/auth.js";
import route from "./routes/auth.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import axios from "axios";
import { GoogleGenAI } from "@google/genai";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
dotenv.config();
const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
const PORT = process.env.PORT;
app.use(express.json());
app.use("/api", route);
app.post("/chat", async function main(req, res) {
  const { message } = req.body;
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: message,
  });
  console.log(response.text);
 return res.json({ response: response.text });
});

app.listen(PORT, () => {
  connectdb();
  console.log(`server is running on ${PORT}`);
});
