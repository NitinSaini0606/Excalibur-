const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require('axios');

const dotenv = require("dotenv");
const fs = require('fs');
const path = require('path');
const  { GoogleGenerativeAI } = require("@google/generative-ai");

// const chatRoutes = require("./routes/chat");

const chatRoute = require("./routes/chat.js");


const { signUp } = require("./controllers/signup.js");
const { login } = require("./controllers/login.js");
const { updateStudentDetails } = require("./controllers/studentDetails");
const adminRoutes = require('./routes/admin');
// const appointmentsRoutes = require("./routes/appointments");


// const { chatHandler } = require('./rag/ragController');
// const { loadDocuments } = require('./rag/vectorStore');

// loadDocuments().then(() => console.log("RAG documents loaded"));

dotenv.config();

const app = express();

// app.use(axios);
app.use(cors());
app.use(bodyParser.json()); 

app.use(cors({
  origin:  'http://localhost:5173',
  methods: ['GET','POST','PUT','DELETE'],
  credentials: true
}));

app.post("/api/signup", signUp);
app.post("/api/login", login);
app.post("/api/student-details", updateStudentDetails);
app.use('/api/admin', adminRoutes);


const db = require('./config/db.js') 

app.post('/api/admin/notify-student', (req, res) => {
  const { studentId, name, hostelNo, roomNo, phone, phq9Score, gad7Score, riskLevel, status } = req.body;

  if (!studentId || !name || !hostelNo || !roomNo || !phone || phq9Score == null || gad7Score == null || !riskLevel || !status) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const query = `
    INSERT INTO admin_notifications 
    (studentId, name, hostelNo, roomNo, phone, phq9Score, gad7Score, riskLevel, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [studentId, name, hostelNo, roomNo, phone, phq9Score, gad7Score, riskLevel, status], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Notification sent to admins', notificationId: result.insertId });
  });
});

// GET notifications for admins
app.get("/api/admin/notifications", (req, res) => {
    const query = "SELECT * FROM admin_notifications ORDER BY createdAt DESC";
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ notifications: results });
    });
});


// app.post('/api/appointments', (req, res) => {
//   const { counselor_name, date, time, type, urgency, reason } = req.body;

//   const sql = `INSERT INTO appointments 
//                (counselor_name, date, time, type, urgency, reason, status) 
//                VALUES (?, ?, ?, ?, ?, ?, 'confirmed')`;

//   db.query(sql, [counselor_name, date, time, type, urgency, reason], (err, result) => {
//     if (err) return res.status(500).json(err);
//     res.json({ success: true, appointmentId: result.insertId });
//   });
// });

// app.post('/api/appointments', (req, res) => {
//   const { student_name, counselor_name, date, time, type, urgency, reason } = req.body;

//   const sql = `INSERT INTO appointments 
//                (student_name, counselor_name, date, time, type, urgency, reason, status) 
//                VALUES (?, ?, ?, ?, ?, ?, ?, 'confirmed')`;

//   db.query(sql, [student_name, counselor_name, date, time, type, urgency, reason], (err, result) => {
//     if (err) return res.status(500).json(err);
//     res.json({ success: true, appointmentId: result.insertId });
//   });
// });

app.post('/api/appointments', (req, res) => {
  const { student_name, counselor_name, date, time, type, urgency, reason } = req.body;

  if (!student_name || !counselor_name || !date || !time || !type || !urgency) {
    return res.status(400).json({ error: "All fields except reason are required" });
  }

  const sql = `INSERT INTO appointments 
               (student_name, counselor_name, date, time, type, urgency, reason, status) 
               VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`;

  db.query(sql, [student_name, counselor_name, date, time, type, urgency, reason], (err, result) => {
    if (err) return res.status(500).json(err);

    const appointmentId = result.insertId;

    // Notify admin in new table
    const notifQuery = `INSERT INTO appointment_notifications
                        (student_name, counselor_name, date, time, type, urgency, reason, status)
                        VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`;

    db.query(notifQuery, [student_name, counselor_name, date, time, type, urgency, reason], (notifErr) => {
      if (notifErr) console.error("Error sending admin notification:", notifErr);
      else console.log("Admin notified for appointment:", appointmentId);
    });

    res.json({ success: true, appointmentId });
  });
});



app.get('/api/appointments', (req, res) => {
  db.query('SELECT * FROM appointments ORDER BY booked_at DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ appointments: results }); // <-- wrap in object with key
  });
});



// GET all appointment notifications for admin dashboard
app.get('/api/admin/appointment-notifications', (req, res) => {
  const query = `SELECT * FROM appointment_notifications ORDER BY created_at DESC`;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ notifications: results });
  });
});


// Save screening test results
app.post("/api/screening/save", (req, res) => {
  const { studentId, name, phq9, gad7, ghq } = req.body;

  if (!studentId || !name) {
    return res.status(400).json({ error: "studentId and name are required" });
  }

  const sql = `
    INSERT INTO screening_results (studentId, name, phq9, gad7, createdAt)
    VALUES (?, ?, ?, ?, NOW())
  `;

  db.query(sql, [studentId, name, phq9, gad7], (err, result) => {
    if (err) {
      console.error("Error saving screening result:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ success: true, message: "Screening result saved" });
  });
});

// ... other routes above

// GET students with Severe risk level
app.get("/api/admin/severe-students", (req, res) => {
  const sql = `
    SELECT studentId, name, hostelNo, roomNo, phone, phq9, gad7, riskLevel 
    FROM screening_results 
    WHERE riskLevel = 'Severe'
    ORDER BY createdAt DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ severeStudents: results });
  });
});




// app.use(bodyParser.json());

// const __dirname = path.resolve();
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// // 🔹 Step 1: Load all .txt files from /backend/data
// let allData = "";
// const dataDir = path.join(__dirname, "data");
// // console.log("Looking for data in:", dataDir);

// if (fs.existsSync(dataDir)) {
//   const files = fs.readdirSync(dataDir);
//   files.forEach((file) => {
//     if (file.endsWith(".txt")) {
//       const content = fs.readFileSync(path.join(dataDir, file), "utf-8");
//       allData += `\n${content}`;
//     }
//   });
// } else {
//   console.warn("⚠️ No data directory found. Create /backend/data and add .txt files.");
// }

// // 🔹 Step 2: Basic context retrieval (simple RAG)
// function getRelevantChunks(query) {
//   const sentences = allData.split(".");
//   const relevant = sentences
//     .filter((s) => s.toLowerCase().includes(query.toLowerCase()))
//     .slice(0, 5)
//     .join(". ");
//   return relevant || sentences.slice(0, 5).join(". ");
// }

// // 🔹 Step 3: API endpoint for chatbot
// app.post("/api/chat", async (req, res) => {
//   try {
//     const { message } = req.body;
//     const context = getRelevantChunks(message);

//     const prompt = `
// You are a helpful assistant. Use the context to answer accurately.

// CONTEXT:
// ${context}

// USER QUESTION:
// ${message}

// ANSWER:
// `;

//     const model = genAI.getGenerativeModel({ model: "gemini-pro" });
//     const result = await model.generateContent(prompt);
//     const response = result.response.text();

//     res.json({ reply: response });
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ error: "Something went wrong" });
//   }
// });

// ... app.listen at the bottom


// app.post('/api/chat', chatHandler);

// app.use("/api/chat", chatRoutes);
app.use("/api", chatRoute);


app.get("/", (req, res) => {
  res.send("Backend is running!");
});
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
