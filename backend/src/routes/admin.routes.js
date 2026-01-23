const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');

const User = require('../models/User');
const Contract = require('../models/Contract');
const Withdrawal = require('../models/Withdrawal');

// 🔐 Protect all admin routes
router.use(authMiddleware, adminMiddleware);

/**
 * 📊 ADMIN DASHBOARD STATS
 */
router.get('/stats', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();

        const totalContracts = await Contract.countDocuments();

        const pendingWithdrawals = await Withdrawal.countDocuments({
            status: 'pending'
        });

        const approvedWithdrawals = await Withdrawal.countDocuments({
            status: 'approved',
            paid: false
        });

        res.json({
            totalUsers,
            totalContracts,
            pendingWithdrawals,
            approvedWithdrawals
        });

    } catch (err) {
        res.status(500).json({
            message: 'Failed to load admin stats'
        });
    }
});

module.exports = router;