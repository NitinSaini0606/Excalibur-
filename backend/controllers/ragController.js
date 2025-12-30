
// const fs = require("fs");
// const path = require("path");
// const { GoogleGenerativeAI } = require("@google/generative-ai");
// const dotenv = require("dotenv");

// dotenv.config();

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// let allData = "";
// const dataDir = path.join(__dirname, "..", "data");

// if (fs.existsSync(dataDir)) {
//   const files = fs.readdirSync(dataDir);
//   files.forEach((file) => {
//     if (file.endsWith(".txt")) {
//       const content = fs.readFileSync(path.join(dataDir, file), "utf-8");
//       allData += `\n${content}`;
//     }
//   });
//   console.log("✅ Loaded text data for chatbot");
// } else {
//   console.warn("⚠️ No data directory found at /backend/data");
// }

// // ✅ Function to get relevant text chunks
// function getRelevantChunks(query) {
//   const sentences = allData.split(".");
//   const relevant = sentences
//     .filter((s) => s.toLowerCase().includes(query.toLowerCase()))
//     .slice(0, 5)
//     .join(". ");
//   return relevant || sentences.slice(0, 5).join(". ");
// }

// // ✅ Main chat handler
// const chatWithGemini = async (req, res) => {
//   try {
//     const { message } = req.body;
//     const context = getRelevantChunks(message);

//     const prompt = `
// You are a helpful assistant. Use the context below to answer accurately.

// CONTEXT:
// ${context}

// USER QUESTION:
// ${message}

// ANSWER:
// `;

//     // const model = genAI.getGenerativeModel({ model: "gemini-pro" });
//     const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

//     const result = await model.generateContent(prompt);
//     const reply = result.response.text();

//     res.json({ reply });
//   } catch (error) {
//     console.error("Chatbot Error:", error);
//     res.status(500).json({ error: "Something went wrong" });
//   }
// };

// module.exports = { chatWithGemini };

// controllers/ragController.js
// import dotenv from "dotenv";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { getRelevantTexts } from "../utils/retriever.js";

const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { getRelevantTexts } = require("../utils/retriever.js");

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const chatWithRAG = async (req, res) => {
  try {
    const { question } = req.body;

    // 1️⃣ Retrieve relevant context from local txt files
    const retrievedTexts = getRelevantTexts(question);
    const context = retrievedTexts.join("\n");

    // 2️⃣ Build prompt for Gemini
    const prompt = `
You are an expert assistant. Use the following information to answer the question.
Context:
${context}

Question: ${question}
Answer:
`;

    // 3️⃣ Generate answer using Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);

    res.json({
      answer: result.response.text(),
      contextUsed: retrievedTexts
    });
  } catch (err) {
    console.error("RAG Chat Error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = { chatWithRAG };
