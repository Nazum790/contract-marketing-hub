const User = require('../models/User');

// Get users who requested verification
exports.getVerificationRequests = async (req, res) => {
    try {
        const requests = await User.find({
            verificationRequested: true,
            emailVerified: false,
        }).select('-password');

        res.json({ users: requests });
    } catch (err) {
        res.status(500).json({ message: 'Failed to load requests' });
    }
};

// Approve verification
exports.verifyUserEmail = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.emailVerified = true;
        user.verificationRequested = false;
        user.verifiedAt = new Date();

        await user.save();

        res.json({ message: 'User email verified successfully' });
    } catch (err) {
        console.error('VERIFY EMAIL ERROR:', err);
        res.status(500).json({ message: 'Verification failed' });
    }
};

// Reject verification
exports.rejectVerificationRequest = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.verificationRequested = false;
        await user.save();

        res.json({ message: 'Verification request rejected' });
    } catch (err) {
        console.error('REJECT EMAIL ERROR:', err);
        res.status(500).json({ message: 'Rejection failed' });
    }
};