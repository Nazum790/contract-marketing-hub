const Withdrawal = require('../models/Withdrawal');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

/**
 * =========================
 * GET PENDING WITHDRAWALS
 * =========================
 */
exports.getPendingWithdrawals = async (req, res) => {
    const withdrawals = await Withdrawal.find({ status: 'pending' })
        .populate('user', 'name email balance currencySymbol')
        .sort({ createdAt: -1 });

    res.json({
        count: withdrawals.length,
        withdrawals,
    });
};

/**
 * =========================
 * APPROVE & PAY WITHDRAWAL
 * =========================
 */
exports.approveWithdrawal = async (req, res) => {
    try {
        const withdrawal = await Withdrawal.findById(req.params.id)
            .populate('user');

        if (!withdrawal) {
            return res.status(404).json({ message: 'Withdrawal not found' });
        }

        if (withdrawal.status !== 'pending') {
            return res.status(400).json({
                message: 'Withdrawal already processed',
            });
        }

        const user = withdrawal.user;

        // 🔒 Balance check
        if (user.balance < withdrawal.amount) {
            return res.status(400).json({
                message: 'Insufficient user balance',
            });
        }

        // ✅ Deduct balance
        user.balance -= withdrawal.amount;
        await user.save();

        // ✅ Mark withdrawal as PAID
        withdrawal.status = 'paid';
        withdrawal.approvedBy = req.user._id;
        withdrawal.processedAt = new Date();
        await withdrawal.save();

        // ✅ Log transaction
        await Transaction.create({
            user: user._id,
            type: 'withdrawal',
            title: 'Withdrawal Paid',
            description: `Withdrawal via ${withdrawal.method}`,
            amount: withdrawal.amount,
        });

        res.json({
            message: 'Withdrawal approved and balance deducted',
            newBalance: user.balance,
        });

    } catch (error) {
        console.error('APPROVE WITHDRAWAL ERROR:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * =========================
 * REJECT WITHDRAWAL
 * =========================
 */
exports.rejectWithdrawal = async (req, res) => {
    try {
        const withdrawal = await Withdrawal.findById(req.params.id);

        if (!withdrawal) {
            return res.status(404).json({ message: 'Withdrawal not found' });
        }

        if (withdrawal.status !== 'pending') {
            return res.status(400).json({
                message: 'Withdrawal already processed',
            });
        }

        withdrawal.status = 'rejected';
        withdrawal.rejectedReason = req.body.reason || 'Rejected by admin';
        withdrawal.processedAt = new Date();

        await withdrawal.save();

        res.json({
            message: 'Withdrawal rejected',
        });

    } catch (error) {
        console.error('REJECT WITHDRAWAL ERROR:', error);
        res.status(500).json({ message: 'Server error' });
    }
};