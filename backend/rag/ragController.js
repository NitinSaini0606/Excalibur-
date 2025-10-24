// // rag/ragController.js
// // import { getRelevantDocs } from './vectorStore.js';
// // import { generateGeminiResponse } from './geminiClient.js';
// const { getRelevantDocs } = require('./vectorStore');
// const { generateGeminiResponse } = require('./geminiClient');
// const chatHandler = async (req, res) => {
//   try {
//     const { question } = req.body;
//     if (!question) return res.status(400).json({ error: 'Question is required' });

//     // 1. Retrieve relevant documents
//     const context = await getRelevantDocs(question);

//     // 2. Generate answer
//     const answer = await generateGeminiResponse(question, context);

//     res.json({ answer });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Something went wrong' });
//   }
// };

// module.exports = { chatHandler };