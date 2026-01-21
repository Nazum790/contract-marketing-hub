const UserContract = require('../models/UserContract');
const Withdrawal = require('../models/Withdrawal');

/**
 * =========================
 * GET USER TRANSACTION HISTORY
 * =========================
 * Read-only merged timeline of contract + withdrawal events
 */
exports.getMyTransactions = async (req, res) => {
    try {
        const userId = req.user._id;
        const timeline = [];

        /**
         * =========================
         * CONTRACT EVENTS
         * =========================
         */
        const contracts = await UserContract.find({ user: userId })
            .populate('contractPlan')
            .sort({ createdAt: -1 });

        contracts.forEach((c) => {
            // Contract requested
            timeline.push({
                type: 'contract_requested',
                title: 'Contract Requested',
                description: c.contractPlan?.name || 'Contract',
                amount: c.entryAmount || null,
                date: c.createdAt,
            });

            // Contract activated
            if (c.startDate) {
                timeline.push({
                    type: 'contract_activated',
                    title: 'Contract Activated',
                    description: c.contractPlan?.name || 'Contract',
                    amount: null,
                    date: c.startDate,
                });
            }

            // Contract completed
            if (c.status === 'completed' && c.completedAt) {
                timeline.push({
                    type: 'contract_completed',
                    title: 'Contract Completed',
                    description: c.contractPlan?.name || 'Contract',
                    amount: null,
                    date: c.completedAt,
                });
            }

            // Balance credited
            if (c.credited && c.creditedAt) {
                timeline.push({
                    type: 'contract_credited',
                    title: 'Balance Credited',
                    description: `Payout from ${c.contractPlan?.name || 'Contract'}`,
                    amount: c.expectedPayout,
                    date: c.creditedAt,
                });
            }
        });

        /**
         * =========================
         * WITHDRAWAL EVENTS (WALLET-BASED)
         * =========================
         */
        const withdrawals = await Withdrawal.find({ user: userId })
            .sort({ createdAt: -1 });

        withdrawals.forEach((w) => {
            // Requested
            timeline.push({
                type: 'withdrawal_requested',
                title: 'Withdrawal Requested',
                description: `Via ${w.method.toUpperCase()}`,
                amount: w.amount,
                status: w.status,
                date: w.createdAt,
            });

            // Paid
            if (w.status === 'paid' && w.processedAt) {
                timeline.push({
                    type: 'withdrawal_paid',
                    title: 'Withdrawal Paid',
                    description: `Via ${w.method.toUpperCase()}`,
                    amount: w.amount,
                    date: w.processedAt,
                });
            }

            // Rejected
            if (w.status === 'rejected' && w.processedAt) {
                timeline.push({
                    type: 'withdrawal_rejected',
                    title: 'Withdrawal Rejected',
                    description: `Via ${w.method.toUpperCase()}`,
                    amount: w.amount,
                    date: w.processedAt,
                });
            }
        });

        /**
         * =========================
         * SORT: NEWEST FIRST
         * =========================
         */
        timeline.sort((a, b) => new Date(b.date) - new Date(a.date));

        res.status(200).json({
            count: timeline.length,
            transactions: timeline,
        });

    } catch (error) {
        console.error('TRANSACTION HISTORY ERROR:', error);
        res.status(500).json({
            message: 'Failed to load transaction history',
        });
    }
};