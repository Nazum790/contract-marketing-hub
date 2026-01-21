const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');

const {
    getPendingWithdrawals,
    approveWithdrawal,
    rejectWithdrawal,
} = require('../controllers/admin.withdrawal.controller');

// 🔐 Protect all admin withdrawal routes
router.use(authMiddleware, adminMiddleware);

/**
 * =========================
 * WITHDRAWAL LISTS
 * =========================
 */

// Pending withdrawals
router.get('/withdrawals/pending', getPendingWithdrawals);

/**
 * =========================
 * WITHDRAWAL ACTIONS
 * =========================
 */

// Approve + PAY (balance deducted immediately)
router.post('/withdrawals/:id/approve', approveWithdrawal);

// Reject withdrawal
router.post('/withdrawals/:id/reject', rejectWithdrawal);

module.exports = router;