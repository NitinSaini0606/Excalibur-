const db = require("../config/db.js"); // your database connection

const submitTest = (req, res) => {
    const { studentId, score } = req.body;

    // Example severe threshold
    const SEVERE_THRESHOLD = 15;

    // First, insert the student's test score (your existing logic)
    const insertTestQuery = "INSERT INTO tests (studentId, score) VALUES (?, ?)";
    db.query(insertTestQuery, [studentId, score], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        // Only notify admins if score exceeds threshold
        if (score >= SEVERE_THRESHOLD) {
            // Get student details
            const getStudentQuery = "SELECT name, hostelNo, roomNo, phone FROM users WHERE studentId = ?";
            db.query(getStudentQuery, [studentId], (err, students) => {
                if (err) return res.status(500).json({ error: err.message });

                const student = students[0];

                const insertNotificationQuery = `
                    INSERT INTO admin_notifications 
                    (studentId, name, hostelNo, roomNo, phone, score) 
                    VALUES (?, ?, ?, ?, ?, ?)
                `;
                db.query(
                    insertNotificationQuery, 
                    [studentId, student.name, student.hostelNo, student.roomNo, student.phone, score],
                    (err, notifResult) => {
                        if (err) console.log("Error inserting notification:", err.message);
                        // You can still return success even if notification fails
                        res.json({ message: "Test submitted and admins notified if needed." });
                    }
                );
            });
        } else {
            res.json({ message: "Test submitted." });
        }
    });
};

module.exports = { submitTest };
