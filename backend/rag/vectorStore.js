// // rag/vectorStore.js
// // import fs from 'fs';
// // import path from 'path';
// // import { generateEmbeddings } from './geminiClient.js'; // You can use Gemini embeddings if supported
// const fs = require('fs');
// const path = require('path');
// const { generateEmbeddings } = require('./geminiClient'); // You can use Gemini embeddings if supported

// // In-memory vector store for simplicity
// let vectorStore = [];

// const loadDocuments = async () => {
// //   const docPath = path.join(process.cwd(), 'data', 'documents');
//   const docPath = path.join(__dirname, '../data');

//   const files = fs.readdirSync(docPath);

//   for (const file of files) {
//     const content = fs.readFileSync(path.join(docPath, file), 'utf8');
//     const chunks = chunkText(content, 500); // split into 500-char chunks
//     for (const chunk of chunks) {
//       const embedding = await generateEmbeddings(chunk);
//       vectorStore.push({ chunk, embedding });
//     }
//   }
// };

// // Simple cosine similarity search
// const getRelevantDocs = async (query, topK = 3) => {
//   const queryEmbedding = await generateEmbeddings(query);

//   const similarities = vectorStore.map(v => ({
//     chunk: v.chunk,
//     score: cosineSimilarity(v.embedding, queryEmbedding)
//   }));

//   similarities.sort((a, b) => b.score - a.score);
//   return similarities.slice(0, topK).map(x => x.chunk);
// };

// // Helper functions
// function chunkText(text, size) {
//   const chunks = [];
//   for (let i = 0; i < text.length; i += size) {
//     chunks.push(text.slice(i, i + size));
//   }
//   return chunks;
// }

// function cosineSimilarity(a, b) {
//   const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
//   const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
//   const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
//   return dot / (normA * normB);
// }

// module.exports = { loadDocuments, getRelevantDocs };