const express = require("express");
const db = require('../config/db') // adjust path if needed

const router = express.Router();

// Create appointment (Student booking)
router.post("/book", (req, res) => {
  const { studentId, appointment_date, appointment_time, reason } = req.body;

  if (!studentId || !appointment_date || !appointment_time) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const query = `
    INSERT INTO appointments (studentId, appointment_date, appointment_time, reason)
    VALUES (?, ?, ?, ?)
  `;

  db.query(query, [studentId, appointment_date, appointment_time, reason], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Appointment booked successfully", appointmentId: result.insertId });
  });
});

// Get all appointments (Admin view with student details)
router.get("/all", (req, res) => {
  const query = `
    SELECT a.*, u.name, u.hostelNo, u.roomNo, u.phone
    FROM appointments a
    JOIN users u ON a.studentId = u.studentId
    ORDER BY a.createdAt DESC
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ appointments: results });
  });
});

module.exports = router;
