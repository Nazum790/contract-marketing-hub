const mongoose = require('mongoose');

const userContractSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        contractPlan: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ContractPlan',
            required: true,
        },

        entryAmount: {
            type: Number,
            required: true,
        },

        expectedPayout: {
            type: Number,
            required: true,
        },

        /**
         * CONTRACT LIFECYCLE
         */
        status: {
            type: String,
            enum: ['pending', 'active', 'completed', 'cancelled'],
            default: 'pending',
        },

        /**
         * ACTIVATION
         */
        startDate: {
            type: Date,
            default: null,
        },

        endDate: {
            type: Date,
            default: null,
        },

        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },

        approvedAt: {
            type: Date,
            default: null,
        },

        /**
         * COMPLETION
         */
        completedAt: {
            type: Date,
            default: null,
        },

        /**
         * CANCELLATION (REJECTED / TERMINATED)
         */
        cancelledAt: {
            type: Date,
            default: null,
        },

        cancelReason: {
            type: String,
            default: null,
        },

        /**
         * CREDITING
         */
        credited: {
            type: Boolean,
            default: false,
        },

        creditedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('UserContract', userContractSchema);