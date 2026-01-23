// ✅ LOAD ENV FIRST — MUST BE FIRST LINE
require('dotenv').config();

const mongoose = require('mongoose');
const app = require('./app');

// 👉 import cron job
const startContractCompletionCron = require('./src/cron/contractCompletion.cron');

const PORT = process.env.PORT || 5000;

// ✅ START SERVER IMMEDIATELY (DO NOT WAIT FOR MONGO)
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// ✅ CONNECT TO MONGO IN BACKGROUND
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected');

        // 👉 start cron jobs ONLY after DB is ready
        startContractCompletionCron();
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err.message);
    });