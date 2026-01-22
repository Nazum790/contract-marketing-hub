// ✅ LOAD ENV FIRST
require('dotenv').config();

const mongoose = require('mongoose');
const app = require('./app');

// 👉 import cron job
const startContractCompletionCron = require('./src/cron/contractCompletion.cron');

const PORT = process.env.PORT || 5000;

// ✅ START SERVER IMMEDIATELY (IMPORTANT FOR RENDER)
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// ✅ CONNECT TO MONGO SEPARATELY
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected');

        // 👉 start cron jobs AFTER DB is ready
        startContractCompletionCron();
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err.message);
    });