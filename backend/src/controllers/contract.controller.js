const UserContract = require('../models/UserContract');
const ContractPlan = require('../models/ContractPlan');
const User = require('../models/User');
// ==============================
// GET ALL ACTIVE CONTRACT PLANS (USER)
// ==============================
exports.getAllContracts = async (req, res) => {
    try {
        const contracts = await ContractPlan.find({ isActive: true })
            .sort({ entryAmount: 1 });

        res.json({
            count: contracts.length,
            contracts,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// ==============================
// REQUEST A CONTRACT (USER)
// ==============================
exports.requestContract = async (req, res) => {
    try {
        const userId = req.user.id;
        const { contractPlanId } = req.body;

        const user = await User.findById(userId);

        if (user.accountRestricted) {
            return res.status(403).json({
                message: 'Your account is restricted. Please check your dashboard for more information.',
            });
        }

        if (!contractPlanId) {
            return res.status(400).json({
                message: 'Contract plan is required',
            });
        }

        // 🚫 BLOCK IF THERE IS A PENDING CONTRACT
        const existingPending = await UserContract.findOne({
            user: userId,
            status: 'pending',
        });

        if (existingPending) {
            return res.status(400).json({
                message:
                    'You already have a pending contract activation. Please wait for admin approval.',
            });
        }

        // ✅ VALIDATE CONTRACT PLAN
        const contractPlan = await ContractPlan.findById(contractPlanId);

        if (!contractPlan || !contractPlan.isActive) {
            return res.status(404).json({
                message: 'Contract plan not found or inactive',
            });
        }

        // 💰 CALCULATIONS
        const entryAmount = contractPlan.entryAmount;
        const grossReturn = entryAmount * contractPlan.multiplier;
        const platformFee =
            (grossReturn * contractPlan.platformFeePercent) / 100;

        const expectedPayout = grossReturn - platformFee;

        // ✅ CREATE CONTRACT REQUEST
        const contract = await UserContract.create({
            user: userId,
            contractPlan: contractPlan._id,
            entryAmount,
            expectedPayout,
            status: 'pending',
            credited: false,
        });

        res.status(201).json({
            message:
                'Contract activation request submitted. Awaiting admin confirmation.',
            contract,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// ==============================
// GET MY CONTRACTS (USER)
// ==============================
exports.getMyContracts = async (req, res) => {
    try {
        const contracts = await UserContract.find({
            user: req.user.id,
        })
            .populate('contractPlan')
            .sort({ createdAt: -1 });

        res.json({
            count: contracts.length,
            contracts,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// ==============================
// GET SINGLE CONTRACT PLAN (DETAILS PAGE)
// ==============================
exports.getContractById = async (req, res) => {
    try {
        const contract = await ContractPlan.findOne({
            _id: req.params.id,
            isActive: true,
        });

        if (!contract) {
            return res.status(404).json({
                message: 'Contract not found',
            });
        }

        res.json({ contract });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};