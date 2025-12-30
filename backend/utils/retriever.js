// utils/retriever.js
// import fs from "fs";
// import path from "path";
// const fs = require("fs");
// const path = require("path");

// function getRelevantTexts(query) {
//   const dataFolder = path.join(process.cwd(), "data");
//   const files = fs.readdirSync(dataFolder).filter(f => f.endsWith(".txt"));

//   let relevantTexts = [];

//   for (const file of files) {
//     const content = fs.readFileSync(path.join(dataFolder, file), "utf-8");
//     if (content.toLowerCase().includes(query.toLowerCase())) {
//       relevantTexts.push(content);
//     }
//   }

//   return relevantTexts;
// }
// module.exports = { getRelevantTexts };



// utils/retriever.js
// import fs from "fs";
// import path from "path";

const fs = require("fs");
const path = require("path");
function getRelevantTexts(query) {
  const dataFolder = path.join(process.cwd(), "data");
  const files = fs.readdirSync(dataFolder).filter(f => f.endsWith(".txt"));

  const queryKeywords = query.toLowerCase().match(/\w+/g); // extract words

  let relevantTexts = [];

  for (const file of files) {
    const content = fs.readFileSync(path.join(dataFolder, file), "utf-8").toLowerCase();

    // Check if any keyword appears in the content
    if (queryKeywords.some(word => content.includes(word))) {
      relevantTexts.push(content);
    }
  }

  return relevantTexts;
}
module.exports = { getRelevantTexts };