const mongoose = require('mongoose');

const PaymentSettingsSchema = new mongoose.Schema(
    {
        statusTitle: {
            type: String,
            default: 'Payment Required',
        },

        statusMessage: {
            type: String,
            default:
                'Please complete payment and send proof for verification. Your contract will be activated after confirmation.',
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