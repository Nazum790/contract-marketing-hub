const User = require('../models/User.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const PasswordResetToken = require('../models/PasswordResetToken');
const countriesConfig = require('../config/countries.config');
const sendEmail = require('../utils/sendEmail');

/**
 * ============================
 * REGISTER USER
 * ============================
 */
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, country, phone } = req.body;

        // =========================
        // BASIC VALIDATION
        // =========================
        if (!name || !email || !password || !country || !phone) {
            return res.status(400).json({
                message: 'All fields including phone number are required',
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: 'Password must be at least 8 characters long',
            });
        }

        // =========================
        // COUNTRY CONFIG
        // =========================
        const countryConfig = countriesConfig[country];
        if (!countryConfig) {
            return res.status(400).json({
                message: 'Selected country is not supported',
            });
        }

        // =========================
        // PHONE NORMALIZATION
        // =========================
        // Allow users to type full number including leading 0
        let cleanedPhone = phone.replace(/\s+/g, '');

        // Remove leading +
        if (cleanedPhone.startsWith('+')) {
            cleanedPhone = cleanedPhone.slice(1);
        }

        // Remove leading country code if user typed full international
        const countryCodeDigits = countryConfig.phone.code.replace('+', '');
        if (cleanedPhone.startsWith(countryCodeDigits)) {
            cleanedPhone = cleanedPhone.slice(countryCodeDigits.length);
        }

        // Remove leading zero (ONLY ONE)
        if (cleanedPhone.startsWith('0')) {
            cleanedPhone = cleanedPhone.slice(1);
        }

        // Validate length
        if (
            cleanedPhone.length < countryConfig.phone.minLength ||
            cleanedPhone.length > countryConfig.phone.maxLength
        ) {
            return res.status(400).json({
                message: `Invalid phone number length for ${country}`,
            });
        }

        // Final international format
        const internationalPhone = `${countryConfig.phone.code}${cleanedPhone}`;

        // =========================
        // UNIQUENESS CHECKS
        // =========================
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({
                message: 'Email already registered',
            });
        }

        const existingPhone = await User.findOne({ phone: internationalPhone });
        if (existingPhone) {
            return res.status(400).json({
                message: 'Phone number already registered',
            });
        }

        // =========================
        // CREATE USER
        // =========================
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone: internationalPhone,
            country,
            currency: countryConfig.currency,
            currencySymbol: countryConfig.symbol,
            emailVerified: false,
        });

        return res.status(201).json({
            message: 'Registration successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                country: user.country,
                currency: user.currency,
                currencySymbol: user.currencySymbol,
            },
        });
    } catch (error) {
        console.error('REGISTER ERROR:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

/**
 * ============================
 * LOGIN USER
 * ============================
 */
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required',
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: 'Invalid email or password',
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: 'Invalid email or password',
            });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        return res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                country: user.country,
                currency: user.currency,
                currencySymbol: user.currencySymbol,
                emailVerified: user.emailVerified,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('LOGIN ERROR:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

/**
 * ============================
 * FORGOT PASSWORD
 * ============================
 */
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: 'Email is required',
            });
        }

        const user = await User.findOne({ email });

        // Always respond the same (security best practice)
        if (!user) {
            return res.json({
                message:
                    'If this email exists, a password reset link has been sent.',
            });
        }

        // Invalidate previous unused tokens
        await PasswordResetToken.updateMany(
            { user: user._id, used: false },
            { used: true }
        );

        const rawToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto
            .createHash('sha256')
            .update(rawToken)
            .digest('hex');

        const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

        await PasswordResetToken.create({
            user: user._id,
            token: hashedToken,
            expiresAt,
        });

        const resetLink = `${process.env.FRONTEND_URL}/auth/reset-password.html?token=${rawToken}`;

        await sendEmail({
            to: user.email,
            subject: 'Reset your password – Contract Marketing Hub',
            html: `
                <p>Hello ${user.name},</p>

                <p>You requested a password reset. Click the button below to set a new password.</p>

                <p>
                    <a href="${resetLink}"
                       style="display:inline-block;padding:12px 20px;
                              background:#0B2C5F;color:#fff;
                              text-decoration:none;border-radius:6px;">
                        Reset Password
                    </a>
                </p>

                <p>This link will expire in 30 minutes.</p>

                <p>If you did not request this, you can safely ignore this email.</p>

                <p>— Contract Marketing Hub</p>
            `,
        });

        return res.json({
            message:
                'If this email exists, a password reset link has been sent.',
        });
    } catch (error) {
        console.error('FORGOT PASSWORD ERROR:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

/**
 * ============================
 * RESET PASSWORD
 * ============================
 */
exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({
                message: 'New password is required',
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: 'Password must be at least 8 characters long',
            });
        }

        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        const resetRecord = await PasswordResetToken.findOne({
            token: hashedToken,
            used: false,
            expiresAt: { $gt: new Date() },
        });

        if (!resetRecord) {
            return res.status(400).json({
                message: 'Invalid or expired reset token',
            });
        }

        const user = await User.findById(resetRecord.user);
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        resetRecord.used = true;
        await resetRecord.save();

        return res.json({
            message: 'Password reset successful. You can now log in.',
        });
    } catch (error) {
        console.error('RESET PASSWORD ERROR:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};