const User = require('../models/User');
const Transaction = require('../models/Transaction');

/**
 * GET LOGGED-IN USER PROFILE
 * Used by Dashboard, Contracts, Transactions, Profile
 */
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select(
            `
            name
            email
            phone
            role
            emailVerified
            verificationRequested
            country
            currency
            currencySymbol
            balance
            createdAt
            `
        );

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error('GET ME ERROR:', error);
        res.status(500).json({
            message: 'Server error',
        });
    }
};

/**
 * REQUEST EMAIL VERIFICATION (USER)
 */
exports.requestEmailVerification = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        if (user.emailVerified) {
            return res.status(400).json({
                message: 'Email already verified',
            });
        }

        if (user.verificationRequested) {
            return res.status(400).json({
                message: 'Verification request already submitted',
            });
        }

        user.verificationRequested = true;
        await user.save();

        // Log activity (transaction history)
        await Transaction.create({
            user: user._id,
            type: 'email_verification_requested',
            title: 'Email Verification Requested',
            description: 'User requested email verification',
        });

        res.status(200).json({
            message: 'Verification request submitted successfully',
        });
    } catch (error) {
        console.error('REQUEST VERIFICATION ERROR:', error);
        res.status(500).json({
            message: 'Server error',
        });
    }
};