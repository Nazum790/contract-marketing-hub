const PaymentSettings = require('../models/PaymentSettings');

/**
 * USER: GET PAYMENT SETTINGS
 */
exports.getPaymentSettings = async (req, res) => {
    try {
        let settings = await PaymentSettings.findOne();

        if (!settings) {
            settings = await PaymentSettings.create({});
        }

        res.json({ settings });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * ADMIN: GET PAYMENT SETTINGS
 */
exports.getAdminPaymentSettings = async (req, res) => {
    try {
        let settings = await PaymentSettings.findOne();

        if (!settings) {
            settings = await PaymentSettings.create({});
        }

        res.json({ settings });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * ADMIN: UPDATE PAYMENT SETTINGS
 */
exports.updatePaymentSettings = async (req, res) => {
    try {
        let settings = await PaymentSettings.findOne();

        if (!settings) {
            settings = await PaymentSettings.create(req.body);
        } else {
            Object.assign(settings, req.body);
            await settings.save();
        }

        res.json({
            message: 'Payment settings updated successfully',
            settings,
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};