const mongoose = require('mongoose');

const contractPlanSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
        },

        entryAmount: {
            type: Number,
            required: true,
        },

        durationDays: {
            type: Number,
            required: true,
        },

        multiplier: {
            type: Number,
            required: true,
        },

        platformFeePercent: {
            type: Number,
            default: 10,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('ContractPlan', contractPlanSchema);