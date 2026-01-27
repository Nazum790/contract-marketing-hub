const User = require('../models/User');
const Transaction = require('../models/Transaction');

/**
 * GET USERS WITH PENDING EMAIL VERIFICATION (ADMIN)
 */
exports.getPendingVerifications = async (req, res) => {
    try {
        const users = await User.find({
            emailVerified: false,
            verificationRequested: true,
        }).select('name email createdAt');

        res.status(200).json({
            count: users.length,
            users,
        });
    } catch (error) {
        console.error('GET PENDING VERIFICATIONS ERROR:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * VERIFY USER EMAIL (ADMIN)
 */
exports.verifyUserEmail = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        if (user.emailVerified) {
            return res.status(400).json({
                message: 'User email already verified',
            });
        }

        user.emailVerified = true;
        user.verificationRequested = false;
        user.verifiedAt = new Date();
        await user.save();

        // Log transaction
        await Transaction.create({
            user: user._id,
            type: 'email_verified',
            title: 'Email Verified',
            description: 'Email verified by admin',
        });

        res.status(200).json({
            message: 'User email verified successfully',
        });
    } catch (error) {
        console.error('VERIFY EMAIL ERROR:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * GET ALL USERS (ADMIN)
 * Minimal list for admin management
 */
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select(`
                name
                email
                phone
                balance
                entryCost
                expectedEarnings
                emailVerified
                createdAt
            `)
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: users.length,
            users,
        });
    } catch (error) {
        console.error('GET ALL USERS ERROR:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * UPDATE USER FINANCIALS (ADMIN)
 * Manual control of balance, entry cost, and expected earnings
 */
exports.updateUserFinancials = async (req, res) => {
    try {
        const userId = req.params.id;
        const { balance, entryCost, expectedEarnings } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        // Manual updates only — no calculations
        if (balance !== undefined) {
            user.balance = Number(balance);
        }

        if (entryCost !== undefined) {
            user.entryCost = Number(entryCost);
        }

        if (expectedEarnings !== undefined) {
            user.expectedEarnings = Number(expectedEarnings);
        }

        await user.save();

        // Log admin action
        await Transaction.create({
            user: user._id,
            type: 'admin_financial_update',
            title: 'Financials Updated',
            description: 'Admin manually updated user financial values',
        });

        res.status(200).json({
            message: 'User financials updated successfully',
            data: {
                balance: user.balance,
                entryCost: user.entryCost,
                expectedEarnings: user.expectedEarnings,
            },
        });
    } catch (error) {
        console.error('UPDATE USER FINANCIALS ERROR:', error);
        res.status(500).json({ message: 'Server error' });
    }
};