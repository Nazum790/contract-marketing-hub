const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');

const {
    getVerificationRequests,
    verifyUserEmail,
    rejectVerificationRequest,
} = require('../controllers/admin.emailVerification.controller');

// 🔐 ADMIN ONLY
router.use(authMiddleware, adminMiddleware);

// GET pending email verification requests
router.get('/', getVerificationRequests);

// APPROVE verification
router.post('/verify/:id', verifyUserEmail);

// REJECT verification
router.post('/reject/:id', rejectVerificationRequest);

module.exports = router;