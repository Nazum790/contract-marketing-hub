const mongoose = require('mongoose');

const PaymentSettingsSchema = new mongoose.Schema(
    {
        statusTitle: {
            type: String,
            default: 'Payment Required',
        },

        // PIX Transfer
        pixBankName: {
            type: String,
            default: '',
        },

        pixAccountName: {
            type: String,
            default: '',
        },

        pixKey: {
            type: String,
            default: '',
        },

        // International Transfer USD
        internationalBankName: {
            type: String,
            default: '',
        },

        internationalAccountName: {
            type: String,
            default: '',
        },

        internationalAccountNumber: {
            type: String,
            default: '',
        },

        internationalSwiftCode: {
            type: String,
            default: '',
        },

        // Crypto Transfer USDT
        usdtNetwork: {
            type: String,
            default: '',
        },

        usdtWalletAddress: {
            type: String,
            default: '',
        },

        supportEmail: {
            type: String,
            default: 'support@contractmarketinghub.com',
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('PaymentSettings', PaymentSettingsSchema);