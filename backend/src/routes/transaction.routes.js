const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth.middleware');
const { getMyTransactions } = require('../controllers/transaction.controller');

/**
 * GET USER TRANSACTION HISTORY
 */
router.get('/my', authMiddleware, getMyTransactions);

module.exports = router;