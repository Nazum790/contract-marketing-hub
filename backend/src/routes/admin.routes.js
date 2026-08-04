const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');

const {
    updateUserFinancials,
    getAllUsers,
    toggleAccountRestriction,
    updateUserAnnouncement,
    resetUserPassword,
    deleteUser
} = require('../controllers/admin.user.controller');

const User = require('../models/User');
const UserContract = require('../models/UserContract');
const Withdrawal = require('../models/Withdrawal');

// 🔒 Protect all admin routes
router.use(authMiddleware, adminMiddleware);

/**
 * ADMIN STATS
 */
router.get('/stats', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({
            accountDeleted: {
                $ne: true
            }
        });
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
        res.status(500).json({
            message: 'Failed to load admin stats'
        });
    }
});

/**
 * GET ALL USERS (ADMIN)
 */
router.get('/users', getAllUsers);

/**
 * UPDATE USER FINANCIALS (ADMIN)
 */
router.put('/users/:id/financials', updateUserFinancials);

/**
 * TOGGLE USER ACCOUNT RESTRICTION (ADMIN)
 */
router.put('/users/:id/restrict', toggleAccountRestriction);

/**
 * UPDATE USER ANNOUNCEMENT (ADMIN)
 * Custom dashboard message per user
 */
router.put('/users/:id/announcement', updateUserAnnouncement);

router.get('/users', getAllUsers);

router.put('/users/:id/financials', updateUserFinancials);

router.put('/users/:id/restrict', toggleAccountRestriction);

router.put('/users/:id/announcement', updateUserAnnouncement);

router.put('/users/:id/reset-password', resetUserPassword);
/**
 * SOFT DELETE USER ACCOUNT (ADMIN)
 */
router.delete('/users/:id', deleteUser);

module.exports = router;