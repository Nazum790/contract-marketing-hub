const UserContract = require('../models/UserContract');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const ContractPlan = require('../models/ContractPlan');

/**
 * =========================
 * ACTIVATE (APPROVE) CONTRACT
 * =========================
 */
exports.activateContract = async (req, res) => {
    try {
        const contract = await UserContract.findById(req.params.id)
            .populate('user')
            .populate('contractPlan');

        if (!contract) {
            return res.status(404).json({ message: 'Contract not found' });
        }

        if (contract.status !== 'pending') {
            return res.status(400).json({
                message: 'Only pending contracts can be activated',
            });
        }

        // Ensure user has no active contract
        const activeContract = await UserContract.findOne({
            user: contract.user._id,
            status: 'active',
        });

        if (activeContract) {
            return res.status(400).json({
                message: 'User already has an active contract',
            });
        }

        const duration = Number(contract.contractPlan?.durationDays);
        if (!duration || duration <= 0) {
            return res.status(400).json({
                message: 'Contract duration is missing or invalid',
            });
        }

        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + duration);

        contract.status = 'active';
        contract.startDate = startDate;
        contract.endDate = endDate;
        contract.approvedBy = req.user._id;
        contract.approvedAt = new Date();

        await contract.save();

        res.json({
            message: 'Contract activated successfully',
            contract,
        });
    } catch (error) {
        console.error('ACTIVATE CONTRACT ERROR:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * =========================
 * REJECT PENDING CONTRACT
 * =========================
 */
exports.rejectContract = async (req, res) => {
    try {
        const contract = await UserContract.findById(req.params.id);

        if (!contract) {
            return res.status(404).json({ message: 'Contract not found' });
        }

        if (contract.status !== 'pending') {
            return res.status(400).json({
                message: 'Only pending contracts can be rejected',
            });
        }

        contract.status = 'cancelled';
        contract.cancelledAt = new Date();
        contract.cancelReason = req.body.reason || 'Rejected by admin';

        await contract.save();

        res.json({
            message: 'Contract rejected successfully',
            contract,
        });
    } catch (error) {
        console.error('REJECT CONTRACT ERROR:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * =========================
 * MARK CONTRACT AS COMPLETED
 * =========================
 */
exports.completeContract = async (req, res) => {
    try {
        const contract = await UserContract.findById(req.params.id);

        if (!contract) {
            return res.status(404).json({ message: 'Contract not found' });
        }

        if (contract.status !== 'active') {
            return res.status(400).json({
                message: 'Only active contracts can be completed',
            });
        }

        contract.status = 'completed';
        contract.completedAt = new Date();

        await contract.save();

        res.json({
            message: 'Contract marked as completed',
            contract,
        });
    } catch (error) {
        console.error('COMPLETE CONTRACT ERROR:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * =========================
 * CREDIT COMPLETED CONTRACT
 * =========================
 */
exports.creditCompletedContract = async (req, res) => {
    try {
        const contract = await UserContract.findById(req.params.id).lean();

        if (!contract) {
            return res.status(404).json({ message: 'Contract not found' });
        }

        if (contract.status !== 'completed') {
            return res.status(400).json({
                message: 'Contract is not completed',
            });
        }

        if (contract.credited) {
            return res.status(400).json({
                message: 'Contract already credited',
            });
        }

        const user = await User.findById(contract.user);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.balance += contract.expectedPayout;
        await user.save();

        await UserContract.findByIdAndUpdate(contract._id, {
            credited: true,
            creditedAt: new Date(),
        });

        await Transaction.create({
            user: user._id,
            type: 'contract_credit',
            title: 'Contract Completed',
            description: 'Contract payout',
            amount: contract.expectedPayout,
        });

        res.json({
            message: 'Balance credited successfully',
            creditedAmount: contract.expectedPayout,
            newBalance: user.balance,
        });
    } catch (error) {
        console.error('CREDIT CONTRACT ERROR:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * =========================
 * ADMIN DASHBOARD VIEWS
 * =========================
 */
exports.getPendingContracts = async (req, res) => {
    try {
        const contracts = await UserContract.find({ status: 'pending' })
            .populate('user', 'name email currencySymbol')
            .populate('contractPlan')
            .lean();

        res.json({ count: contracts.length, contracts });
    } catch (error) {
        console.error('PENDING CONTRACT LOAD ERROR:', error);
        res.status(500).json({ message: 'Failed to load pending contracts' });
    }
};

exports.getActiveContracts = async (req, res) => {
    try {
        const contracts = await UserContract.find({ status: 'active' })
            .populate('user', 'name email currencySymbol')
            .populate('contractPlan') // ✅ THIS IS THE FIX
            .lean();

        res.json({ count: contracts.length, contracts });
    } catch (error) {
        console.error('ACTIVE CONTRACT LOAD ERROR:', error);
        res.status(500).json({ message: 'Failed to load active contracts' });
    }
};

exports.getCompletedContracts = async (req, res) => {
    try {
        const contracts = await UserContract.find({
            status: 'completed',
            credited: false,
        })
            .populate('user', 'name email currencySymbol')
            .populate('contractPlan') // ✅ SAME FIX
            .lean();

        res.json({ count: contracts.length, contracts });
    } catch (error) {
        console.error('COMPLETED CONTRACT LOAD ERROR:', error);
        res.status(500).json({ message: 'Failed to load completed contracts' });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select(
            'name email role balance emailVerified isSuspended currencySymbol createdAt'
        );

        res.json({ count: users.length, users });
    } catch (error) {
        console.error('GET USERS ERROR:', error);
        res.status(500).json({ message: 'Failed to load users' });
    }
};