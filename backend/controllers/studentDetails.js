
// const db = require("../config/db.js");

// const updateStudentDetails = (req, res) => {
//   const { userId, hostelNo, roomNo, phone } = req.body;

//   if (!userId) {
//     return res.status(400).json({ message: "User ID is required" });
//   }

//   const sql = `
//     UPDATE users 
//     SET hostelNo = ?, roomNo = ?, phone = ? 
//     WHERE id = ?`;

//   db.query(sql, [hostelNo, roomNo, phone, userId], (err, result) => {
//     if (err) {
//       console.error("Error updating details:", err);
//       return res.status(500).json({ message: "Database error" });
//     }
//     res.status(200).json({ message: "Details updated successfully" });
//   });
// };

// module.exports = { updateStudentDetails };

const db = require("../config/db.js");

const updateStudentDetails = (req, res) => {
  const { userId, hostelNo, roomNo, phone } = req.body;

  if (!userId) return res.status(400).json({ error: "User ID is required" });

  const query = "UPDATE users SET hostelNo = ?, roomNo = ?, phone = ? WHERE id = ?";
  db.query(query, [hostelNo || null, roomNo || null, phone || null, userId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "Student details saved successfully" });
  });
};

module.exports = { updateStudentDetails };
