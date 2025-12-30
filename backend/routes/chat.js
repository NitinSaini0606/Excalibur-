// const express = require("express");
// const router = express.Router();
// const { chatWithGemini } = require("../controllers/ragController");

// router.post("/", chatWithGemini);

// module.exports = router;


// routes/chat.js
// import express from "express";
// import { chatWithRAG } from "../controllers/ragController.js";
const express = require("express");
const { chatWithRAG } = require("../controllers/ragController.js");

const router = express.Router();

router.post("/chat", chatWithRAG);

module.exports = router;
