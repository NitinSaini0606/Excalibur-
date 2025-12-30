// const { ModelsClient } = require("@google/generative-ai");
// const  dotenv = require("dotenv");

// dotenv.config();

// const client = new ModelsClient({
//   apiKey: process.env.GEMINI_API_KEY,
// });

// async function listModels() {
//   try {
//     const response = await client.listModels();
//     console.log("Available Models:");
//     response.models.forEach((model) => {
//       console.log(`${model.name} - ${model.supportedGenerationMethods}`);
//     });
//   } catch (error) {
//     console.error("Error listing models:", error);
//   }
// }

// listModels();


import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

async function listModels() {
  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models",
      {
        headers: {
          "x-goog-api-key": process.env.GEMINI_API_KEY,
        },
      }
    );

    if (!response.ok) throw new Error(`HTTP error! ${response.status}`);

    const data = await response.json();

    console.log("Available Models:\n");
    data.models.forEach((model) => {
      console.log(`${model.name} — ${model.supportedGenerationMethods}`);
    });
  } catch (err) {
    console.error("Error listing models:", err);
  }
}

listModels();
