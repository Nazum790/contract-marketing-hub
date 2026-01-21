const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');

const paymentSettingsController = require('../controllers/paymentSettings.controller');

/**
 * =========================
 * USER (READ ONLY)
 * =========================
 */
router.get(
    '/',
    paymentSettingsController.getPaymentSettings
);

/**
 * =========================
 * ADMIN (MANAGE)
 * =========================
 */
router.get(
    '/admin',
    authMiddleware,
    adminMiddleware,
    paymentSettingsController.getAdminPaymentSettings
);

router.put(
    '/admin',
    authMiddleware,
    adminMiddleware,
    paymentSettingsController.updatePaymentSettings
);

module.exports = router;