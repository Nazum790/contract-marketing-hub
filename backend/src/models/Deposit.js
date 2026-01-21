const mongoose = require('mongoose');

const depositSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        userContract: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserContract',
            required: true
        },

        amount: {
            type: Number,
            required: true
        },

        paymentMethod: {
            type: String,
            required: true
        },

        proof: {
            type: String,
            required: true
        },

        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending'
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Deposit', depositSchema);