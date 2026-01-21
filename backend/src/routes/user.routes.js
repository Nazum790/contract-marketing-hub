const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth.middleware');
const {
    getMe,
    requestEmailVerification
} = require('../controllers/user.controller');

/**
 * GET LOGGED-IN USER PROFILE
 */
router.get('/me', authMiddleware, getMe);

/**
 * REQUEST EMAIL VERIFICATION (USER)
 */
router.post(
    '/request-verification',
    authMiddleware,
    requestEmailVerification
);

module.exports = router;