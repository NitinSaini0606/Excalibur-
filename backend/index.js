const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require('axios');

const { signUp } = require("./controllers/signup.js");
const { login } = require("./controllers/login.js");
const { updateStudentDetails } = require("./controllers/studentDetails");
const adminRoutes = require('./routes/admin');
// const appointmentsRoutes = require("./routes/appointments");


// const { chatHandler } = require('./rag/ragController');
// const { loadDocuments } = require('./rag/vectorStore');

// loadDocuments().then(() => console.log("RAG documents loaded"));



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
// app.use("/api/appointments", appointmentsRoutes);

// Import your database connection
const db = require('./config/db.js') // adjust path if your db.js is somewhere else

// Route to send notification to admins
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



// Optional: Get all appointments
// app.get('/api/appointments', (req, res) => {
//   db.query('SELECT * FROM appointments ORDER BY booked_at DESC', (err, results) => {
//     if (err) return res.status(500).json(err);
//     res.json(results);
//   });
// });
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

// ... app.listen at the bottom


// app.post('/api/chat', chatHandler);


app.get("/", (req, res) => {
  res.send("Backend is running!");
});
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
