
const jwt = require("jsonwebtoken");
const db = require("../config/db.js");
const bcrypt = require("bcrypt");

const signUp = (req, res) => {
  const { name, studentId, role, email, password } = req.body;

  // Check required fields
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "Please fill all required fields" });
  }

  const saltRounds = 10;

  // Hash the password
  bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
    if (err) return res.status(500).json({ error: "Error hashing password" });

    // Insert user into database
    const query = "INSERT INTO users (name, studentId, role, email, password) VALUES (?, ?, ?, ?, ?)";
    db.query(query, [name, studentId, role, email, hashedPassword], (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ error: "Email already registered" });
        }
        return res.status(500).json({ error: err.message });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: result.insertId, email: email, role: role },
        "your_jwt_secret_key",   // <-- replace with your secret key
        { expiresIn: "1h" }
      );

      // Send response with user info and token
      res.status(201).json({
        message: "User registered successfully",
        user: {
          id: result.insertId,
          name: name,
          email: email,
          role: role
        },
        token: token
      });
    });
  });
};

module.exports = { signUp };
