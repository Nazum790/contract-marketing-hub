require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const authMiddleware = require('./src/middleware/auth.middleware');

const app = express();

// =====================
// ENABLE CORS (DEV MODE)
// =====================
app.use(
    cors({
        origin: '*',
    })
);

// =====================
// BODY PARSER
// =====================
app.use(express.json());

// =====================
// ROUTE IMPORTS
// =====================

// AUTH
const authRoutes = require('./src/routes/auth.routes');

// USER CONTRACTS
const contractRoutes = require('./src/routes/contract.routes');

// ADMIN ROUTES (SPLIT & SPECIFIC)
const adminRoutes = require('./src/routes/admin.routes');
const adminWithdrawalRoutes = require('./src/routes/admin.withdrawal.routes');
const adminEmailVerificationRoutes =
    require('./src/routes/admin.emailVerification.routes');
const adminContractRoutes =
    require('./src/routes/admin.contract.routes');

// USER ROUTES
const userRoutes = require('./src/routes/user.routes');
const transactionRoutes = require('./src/routes/transaction.routes');
const withdrawalRoutes = require('./src/routes/withdrawal.routes');

// SHARED
const paymentSettingsRoutes = require('./src/routes/paymentSettings.routes');

// =====================
// REGISTER API ROUTES
// =====================

// AUTH
app.use('/api/auth', authRoutes);

// USER CONTRACTS
app.use('/api/contracts', contractRoutes);

// =====================
// ADMIN ROUTES (⚠️ ORDER IS CRITICAL)
// =====================

// 1️⃣ MOST SPECIFIC — EMAIL VERIFICATION
app.use('/api/admin/email-verifications', adminEmailVerificationRoutes);

// 2️⃣ CONTRACT MANAGEMENT
app.use('/api/admin/contracts', adminContractRoutes);

// 3️⃣ WITHDRAWALS (ADMIN)
app.use('/api/admin', adminWithdrawalRoutes);

// 4️⃣ GENERIC ADMIN ROUTES (⚠️ MUST BE LAST)
app.use('/api/admin', adminRoutes);

// =====================
// USER ROUTES
// =====================
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/withdrawals', withdrawalRoutes);

// =====================
// SHARED ROUTES
// =====================
app.use('/api/payment-settings', paymentSettingsRoutes);

// =====================
// ROOT ROUTE → FRONTEND HOMEPAGE
// =====================
app.get('/', (req, res) => {
    res.sendFile(
        path.join(__dirname, '..', 'frontend', 'index.html')
    );
});

// =====================
// SERVE FRONTEND STATIC FILES (ABSOLUTELY LAST)
// =====================
app.use(
    express.static(path.join(__dirname, '..', 'frontend'))
);

// =====================
// BASIC TEST / DEBUG ROUTES
// =====================
app.get('/api/protected', authMiddleware, (req, res) => {
    res.json({
        message: 'You have access to this protected route',
        user: req.user,
    });
});

module.exports = app;