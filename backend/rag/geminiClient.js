// // rag/geminiClient.js
// // import axios from 'axios';
// const axios = require('axios');

// const GEMINI_KEY = 'AIzaSyAHtgm6fXmhTvDmig6OeQbYz03lQmcgQ3k';

// // Generate response using Gemini
// const generateGeminiResponse = async (question, context) => {
//   const prompt = `
// You are an assistant. Use the following context to answer the question:
// Context: ${context.join('\n')}
// Question: ${question}
// Answer:`;

//   const response = await axios.post(
//     'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5:generate', // replace with actual Gemini endpoint
//     { prompt, model: 'gemini-1.5', max_tokens: 500 },
//     { headers: { Authorization: `Bearer ${GEMINI_KEY}` } }
//   );

//   return response.data.output_text;
// };

// // Generate embeddings using Gemini (if supported)
// const generateEmbeddings = async (text) => {
//   const response = await axios.post(
//     'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5:embedText', // replace if endpoint exists
//     { input: text, model: 'gemini-embedding-1.0' },
//     { headers: { Authorization: `Bearer ${GEMINI_KEY}` } }
//   );

//   return response.data.embedding;
// };


// module.exports = { generateGeminiResponse, generateEmbeddings };



// const axios = require('axios');

// const GEMINI_KEY = 'AIzaSyAHtgm6fXmhTvDmig6OeQbYz03lQmcgQ3k';

// // Generate response using Gemini
// const generateGeminiResponse = async (question, context) => {
//   const prompt = `
// You are an assistant. Use the following context to answer the question:
// Context: ${context.join('\n')}
// Question: ${question}
// Answer:`;

//   const response = await axios.post(
//     'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5:generateContent',
//     { prompt, max_output_tokens: 500 },
//     {
//       headers: {
//         Authorization: `Bearer ${GEMINI_KEY}`,
//         'Content-Type': 'application/json',
//       },
//     }
//   );

//   return response.data.candidates[0].content; // Gemini 1.5 returns an array of candidates
// };

// // Generate embeddings using Gemini
// const generateEmbeddings = async (text) => {
//   const response = await axios.post(
//     'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5:embedText',
//     { text },
//     {
//       headers: {
//         Authorization: `Bearer ${GEMINI_KEY}`,
//         'Content-Type': 'application/json',
//       },
//     }
//   );

//   return response.data.embedding; // returns vector array
// };

// module.exports = { generateGeminiResponse, generateEmbeddings };


// rag/geminiClient.js
// const axios = require('axios');
// const { GoogleAuth } = require('google-auth-library');
// const path = require('path');

// // Path to your service account JSON
// // const SERVICE_ACCOUNT_FILE = path.join(__dirname, 'service-account.json');
// const SERVICE_ACCOUNT_FILE = 'C:/Users/Dell/OneDrive/Desktop/MindTechAppSIH/project/backend/keys/service-account.json';

// // Function to get OAuth2 token
// async function getAccessToken() {
//   const auth = new GoogleAuth({
//     keyFile: SERVICE_ACCOUNT_FILE,
//     scopes: 'https://www.googleapis.com/auth/cloud-platform',
//   });

//   const client = await auth.getClient();
//   const tokenResponse = await client.getAccessToken();
//   return tokenResponse.token;
// }

// // Generate response using Gemini
// async function generateGeminiResponse(question, context = []) {
//   const accessToken = await getAccessToken();

//   const prompt = `
// You are an assistant. Use the following context to answer the question:
// Context: ${context.join('\n')}
// Question: ${question}
// Answer:`;

//   const response = await axios.post(
//     'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5:generateContent',
//     {
//       prompt,
//       max_output_tokens: 500,
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         'Content-Type': 'application/json',
//       },
//     }
//   );

//   return response.data.candidates?.[0]?.content || '';
// }

// // Generate embeddings using Gemini (if supported)
// async function generateEmbeddings(text) {
//   const accessToken = await getAccessToken();

//   const response = await axios.post(
//     'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5/embedText',
//     {
//       input: text,
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         'Content-Type': 'application/json',
//       },
//     }
//   );

//   return response.data?.embedding || [];
// }

// module.exports = { generateGeminiResponse, generateEmbeddings };
