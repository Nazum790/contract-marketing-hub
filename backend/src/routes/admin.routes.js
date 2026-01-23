const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');

const User = require('../models/User');
const UserContract = require('../models/UserContract');
const Withdrawal = require('../models/Withdrawal');

router.use(authMiddleware, adminMiddleware);

router.get('/stats', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();

        const totalContracts = await UserContract.countDocuments();

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
        res.status(500).json({ message: 'Failed to load admin stats' });
    }
});

module.exports = router;