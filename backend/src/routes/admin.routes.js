const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');

// 🔐 Protect admin dashboard-only routes
router.use(authMiddleware, adminMiddleware);

// Optional: simple test route (safe)
router.get('/stats', (req, res) => {
    res.json({ message: 'Admin routes working' });
});

module.exports = router;