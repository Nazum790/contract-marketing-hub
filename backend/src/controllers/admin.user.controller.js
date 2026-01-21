const User = require('../models/User');
const Transaction = require('../models/Transaction');

/**
 * GET USERS WITH PENDING EMAIL VERIFICATION
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