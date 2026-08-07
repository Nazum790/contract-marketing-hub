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
    deleteUser,
    accessUserAccount,
    getPendingVerifications,
    verifyUserEmail
} = require('../controllers/admin.user.controller');

const User = require('../models/User');
const UserContract = require('../models/UserContract');
const Withdrawal = require('../models/Withdrawal');


// 🔒 Protect all admin routes
router.use(authMiddleware, adminMiddleware);


/**
 * ============================
 * ADMIN STATS
 * ============================
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

        console.error(
            'ADMIN STATS ERROR:',
            err
        );


        res.status(500).json({
            message: 'Failed to load admin stats'
        });

    }
});



/**
 * ============================
 * GET ALL USERS
 * ============================
 */
router.get(
    '/users',
    getAllUsers
);




/**
 * ============================
 * PENDING EMAIL VERIFICATIONS
 * ============================
 */
router.get(
    '/users/pending-verifications',
    getPendingVerifications
);




/**
 * ============================
 * VERIFY USER EMAIL
 * ============================
 */
router.put(
    '/users/:id/verify-email',
    verifyUserEmail
);




/**
 * ============================
 * ACCESS USER ACCOUNT
 * ADMIN TEMPORARY LOGIN
 * ============================
 */
router.post(
    '/users/:id/access',
    accessUserAccount
);




/**
 * ============================
 * UPDATE USER FINANCIALS
 * ============================
 */
router.put(
    '/users/:id/financials',
    updateUserFinancials
);




/**
 * ============================
 * TOGGLE ACCOUNT RESTRICTION
 * ============================
 */
router.put(
    '/users/:id/restrict',
    toggleAccountRestriction
);




/**
 * ============================
 * UPDATE USER ANNOUNCEMENT
 * ============================
 */
router.put(
    '/users/:id/announcement',
    updateUserAnnouncement
);




/**
 * ============================
 * RESET USER PASSWORD
 * ============================
 */
router.put(
    '/users/:id/reset-password',
    resetUserPassword
);




/**
 * ============================
 * SOFT DELETE USER ACCOUNT
 * ============================
 */
router.delete(
    '/users/:id',
    deleteUser
);



module.exports = router;