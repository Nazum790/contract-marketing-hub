const mongoose = require('mongoose');

const withdrawalSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },

        amount: {
            type: Number,
            required: true,
            min: 1,
        },

        /**
         * Withdrawal method
         * Matches frontend + controller
         */
        method: {
            type: String,
            enum: ['bank', 'pix', 'crypto'],
            required: true,
        },

        /**
         * Dynamic payment details
         * Examples:
         * - bank: { bankName, accountName, accountNumber }
         * - pix: { pixKey }
         * - crypto: { coin, walletAddress }
         */
        methodDetails: {
            type: Object,
            required: true,
        },

        /**
         * Withdrawal status lifecycle
         */
        status: {
            type: String,
            enum: ['pending', 'approved', 'paid', 'rejected'],
            default: 'pending',
            index: true,
        },

        /**
         * Admin actions
         */
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },

        rejectedReason: {
            type: String,
            default: null,
        },

        processedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

/**
 * Prevent multiple pending withdrawals per user
 */
withdrawalSchema.index(
    { user: 1, status: 1 },
    { unique: true, partialFilterExpression: { status: 'pending' } }
);

module.exports = mongoose.model('Withdrawal', withdrawalSchema);