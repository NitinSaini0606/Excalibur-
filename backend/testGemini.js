// import { GoogleGenerativeAI } from "@google/generative-ai";
// import dotenv from "dotenv";
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function test() {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const result = await model.generateContent("Hello Gemini!");
  console.log(result.response.text());
}

test();
