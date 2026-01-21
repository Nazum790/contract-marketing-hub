const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

// 👉 import cron job
const startContractCompletionCron = require('./src/cron/contractCompletion.cron');

dotenv.config();

const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected');

        // 👉 start cron jobs AFTER DB is ready
        startContractCompletionCron();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err.message);
    });