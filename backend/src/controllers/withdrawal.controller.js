const Withdrawal = require('../models/Withdrawal');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

/**
 * USER: REQUEST WITHDRAWAL
 * Wallet-based withdrawal (not per contract)
 */
exports.requestWithdrawal = async (req, res) => {
    try {
        const userId = req.user._id;
        const { amount, method, methodDetails } = req.body;

        /**
         * =========================
         * BASIC VALIDATION
         * =========================
         */
        if (!amount || !method || !methodDetails) {
            return res.status(400).json({
                message: 'Amount, method and payment details are required',
            });
        }

        if (typeof amount !== 'number' || amount <= 0) {
            return res.status(400).json({
                message: 'Invalid withdrawal amount',
            });
        }

        /**
         * =========================
         * ALLOWED METHODS
         * =========================
         */
        const allowedMethods = ['bank', 'pix', 'crypto'];

        if (!allowedMethods.includes(method)) {
            return res.status(400).json({
                message: 'Unsupported withdrawal method',
            });
        }

        if (typeof methodDetails !== 'object' || Object.keys(methodDetails).length === 0) {
            return res.status(400).json({
                message: 'Payment details are required',
            });
        }

        /**
         * =========================
         * USER BALANCE CHECK
         * =========================
         */
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        if (user.accountRestricted) {
            return res.status(403).json({
                message:
                    'Your account is currently restricted. Withdrawals are temporarily disabled. Please contact support.',
            });
        }

        if (amount > user.balance) {
            return res.status(400).json({
                message: 'Insufficient balance',
            });
        }
        /**
         * =========================
         * PREVENT MULTIPLE PENDING
         * =========================
         */
        const pendingWithdrawal = await Withdrawal.findOne({
            user: userId,
            status: 'pending',
        });

        if (pendingWithdrawal) {
            return res.status(400).json({
                message: 'You already have a pending withdrawal request',
            });
        }

        /**
         * =========================
         * CREATE WITHDRAWAL
         * =========================
         */
        const withdrawal = await Withdrawal.create({
            user: userId,
            amount,
            method,
            methodDetails,
            status: 'pending',
        });

        /**
         * =========================
         * LOG TRANSACTION
         * =========================
         */
        await Transaction.create({
            user: userId,
            type: 'withdrawal_requested',
            title: 'Withdrawal Requested',
            description: `Withdrawal of ${amount} requested via ${method}`,
            amount: amount,
        });

        return res.status(201).json({
            message: 'Withdrawal request submitted successfully',
            withdrawal,
        });

    } catch (error) {
        console.error('WITHDRAWAL REQUEST ERROR:', error);
        res.status(500).json({
            message: 'Server error',
        });
    }
};