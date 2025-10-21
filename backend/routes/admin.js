const express = require('express');
const router = express.Router();
const db = require('../config/db.js');

router.get('/api/admin/notifications', (req, res) => {
    const query = "SELECT * FROM admin_notifications ORDER BY createdAt DESC";
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ notifications: results });
    });
});

module.exports = router;
