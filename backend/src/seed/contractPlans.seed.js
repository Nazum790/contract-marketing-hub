const mongoose = require('mongoose');
require('dotenv').config();

const ContractPlan = require('../models/ContractPlan');

const plans = [
    {
        name: 'Starter Plan',
        description: 'Fast-entry starter contract with short duration.',
        entryAmount: 500,
        multiplier: 10.8,
        platformFeePercent: 10,
        durationDays: 2,
        isActive: true,
    },
    {
        name: 'Apex Growth Contract',
        description: 'Entry-level contract with quick, modest returns.',
        entryAmount: 1125,
        multiplier: 12,
        platformFeePercent: 10,
        durationDays: 7,
        isActive: true,
    },
    {
        name: 'Prime Yield Contract',
        description: 'Steady returns over short duration.',
        entryAmount: 3250,
        multiplier: 10.8,
        platformFeePercent: 10,
        durationDays: 19,
        isActive: true,
    },
    {
        name: 'Infinity Profit Contract',
        description: 'Compounding returns for gradual growth.',
        entryAmount: 5113,
        multiplier: 10.8,
        platformFeePercent: 10,
        durationDays: 28,
        isActive: true,
    },
    {
        name: 'Titan Venture Contract',
        description: 'Mid-tier strategic growth plan.',
        entryAmount: 7226,
        multiplier: 10.8,
        platformFeePercent: 10,
        durationDays: 37,
        isActive: true,
    },
    {
        name: 'Nova Asset Contract',
        description: 'Diversified income streams.',
        entryAmount: 9105,
        multiplier: 10.8,
        platformFeePercent: 10,
        durationDays: 56,
        isActive: true,
    },
    {
        name: 'Quantum Edge Contract',
        description: 'Advanced long-term ROI.',
        entryAmount: 12316,
        multiplier: 10.8,
        platformFeePercent: 10,
        durationDays: 71,
        isActive: true,
    },
    {
        name: 'Legacy Builder Contract',
        description: 'Long-term wealth creation.',
        entryAmount: 21400,
        multiplier: 10.8,
        platformFeePercent: 10,
        durationDays: 94,
        isActive: true,
    },
    {
        name: 'Momentum Gain Contract',
        description: 'Fast and high returns.',
        entryAmount: 37181,
        multiplier: 10.8,
        platformFeePercent: 10,
        durationDays: 111,
        isActive: true,
    },
    {
        name: 'Vanguard Premium Contract',
        description: 'Elite investment plan.',
        entryAmount: 53116,
        multiplier: 10.8,
        platformFeePercent: 10,
        durationDays: 148,
        isActive: true,
    },
    {
        name: 'Horizon Expansion Contract',
        description: 'Maximum return potential.',
        entryAmount: 78900,
        multiplier: 10.8,
        platformFeePercent: 10,
        durationDays: 171,
        isActive: true,
    },
];

(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        await ContractPlan.deleteMany();
        await ContractPlan.insertMany(plans);
        console.log('✅ 11 contract plans seeded successfully');
        process.exit();
    } catch (err) {
        console.error('❌ Seeding failed:', err);
        process.exit(1);
    }
})();