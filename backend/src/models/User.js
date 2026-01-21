const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        // =====================
        // BASIC INFO
        // =====================
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        // =====================
        // AUTH & SECURITY
        // =====================
        password: {
            type: String,
            required: true,
        },

        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
            index: true, // 🔐 faster admin checks
        },

        isSuspended: {
            type: Boolean,
            default: false,
        },

        // =====================
        // EMAIL VERIFICATION
        // =====================
        emailVerified: {
            type: Boolean,
            default: false,
        },

        verificationRequested: {
            type: Boolean,
            default: false,
        },

        verifiedAt: {
            type: Date,
            default: null,
        },

        // =====================
        // PASSWORD RESET
        // =====================
        resetPasswordToken: {
            type: String,
            default: null,
        },

        resetPasswordExpires: {
            type: Date,
            default: null,
        },

        // =====================
        // LOCATION & CURRENCY
        // =====================
        country: {
            type: String,
            default: null,
        },

        currency: {
            type: String,
            default: 'USD',
        },

        currencySymbol: {
            type: String,
            default: '$',
        },

        // =====================
        // FINANCIALS
        // =====================
        balance: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('User', userSchema);