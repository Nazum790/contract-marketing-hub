const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth.middleware');

const {
    requestWithdrawal,
} = require('../controllers/withdrawal.controller');

/**
 * =========================
 * USER WITHDRAWAL ROUTES
 * =========================
 */

// User requests withdrawal
router.post('/', authMiddleware, requestWithdrawal);

module.exports = router;