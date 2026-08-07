const User = require('../models/User');
const Transaction = require('../models/Transaction');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');


/**
 * GET USERS WITH PENDING EMAIL VERIFICATION (ADMIN)
 */
exports.getPendingVerifications = async (req, res) => {
    try {

        const users = await User.find({
            emailVerified: false,
            verificationRequested: true,
        }).select('name email createdAt');


        res.status(200).json({
            count: users.length,
            users,
        });


    } catch (error) {

        console.error('GET PENDING VERIFICATIONS ERROR:', error);

        res.status(500).json({
            message: 'Server error'
        });

    }
};





/**
 * VERIFY USER EMAIL (ADMIN)
 */
exports.verifyUserEmail = async (req, res) => {

    try {

        const user = await User.findById(req.params.id);


        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }


        if (user.emailVerified) {
            return res.status(400).json({
                message: 'User email already verified'
            });
        }


        user.emailVerified = true;
        user.verificationRequested = false;
        user.verifiedAt = new Date();


        await user.save();



        await Transaction.create({

            user: user._id,

            type: 'email_verified',

            title: 'Email Verified',

            description: 'Email verified by admin'

        });



        res.status(200).json({

            message: 'User email verified successfully'

        });



    } catch (error) {


        console.error('VERIFY EMAIL ERROR:', error);


        res.status(500).json({
            message: 'Server error'
        });

    }

};








/**
 * GET ALL USERS (ADMIN)
 */
exports.getAllUsers = async (req, res) => {

    try {


        const users = await User.find({
            role: 'user',
            $or: [
                { accountDeleted: false },
                { accountDeleted: { $exists: false } }
            ]
        })
            .select(`
            name
            email
            phone
            balance
            entryCost
            expectedEarnings
            emailVerified
            accountRestricted
            restrictionTitle
            restrictionMessage
            announcement
            createdAt
        `)

            .sort({
                createdAt: -1
            });



        res.status(200).json({

            count: users.length,

            users

        });



    } catch (error) {


        console.error(
            'GET ALL USERS ERROR:',
            error
        );


        res.status(500).json({
            message: 'Server error'
        });


    }

};








/**
 * UPDATE USER FINANCIALS (ADMIN)
 */
exports.updateUserFinancials = async (req, res) => {


    try {


        const user = await User.findById(req.params.id);



        if (!user) {

            return res.status(404).json({
                message: 'User not found'
            });

        }



        const {
            balance,
            entryCost,
            expectedEarnings

        } = req.body;



        if (balance !== undefined) {

            user.balance = Number(balance);

        }


        if (entryCost !== undefined) {

            user.entryCost = Number(entryCost);

        }


        if (expectedEarnings !== undefined) {

            user.expectedEarnings = Number(expectedEarnings);

        }



        await user.save();




        await Transaction.create({

            user: user._id,

            type: 'admin_financial_update',

            title: 'Financials Updated',

            description:
                'Admin manually updated user financial values'

        });





        res.status(200).json({

            message:
                'User financials updated successfully',

            data: {

                balance: user.balance,

                entryCost: user.entryCost,

                expectedEarnings: user.expectedEarnings

            }

        });



    } catch (error) {


        console.error(
            'UPDATE FINANCIALS ERROR:',
            error
        );


        res.status(500).json({
            message: 'Server error'
        });

    }

};















/**
 * TOGGLE USER ACCOUNT RESTRICTION (ADMIN)
 */
exports.toggleAccountRestriction = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        const {
            restrictionTitle,
            restrictionMessage
        } = req.body;


        // Toggle restriction status
        user.accountRestricted = !user.accountRestricted;


        // Save restriction details only when restricting
        if (user.accountRestricted) {

            user.restrictionTitle =
                restrictionTitle || 'Account Restricted';

            user.restrictionMessage =
                restrictionMessage ||
                'Your account has been restricted. Please contact support.';

        } else {

            // Clear old restriction details when unrestricted
            user.restrictionTitle = '';
            user.restrictionMessage = '';

        }


        await user.save();



        await Transaction.create({

            user: user._id,

            type: 'account_restriction_toggle',

            title: user.accountRestricted
                ? 'Account Restricted'
                : 'Account Unrestricted',

            description: user.accountRestricted
                ? `${user.restrictionTitle}: ${user.restrictionMessage}`
                : 'Admin lifted account restriction',

        });



        res.status(200).json({

            message: user.accountRestricted
                ? 'User account restricted successfully'
                : 'User account unrestricted successfully',

            accountRestricted: user.accountRestricted,

            restrictionTitle: user.restrictionTitle,

            restrictionMessage: user.restrictionMessage

        });


    } catch (error) {

        console.error(
            'TOGGLE ACCOUNT RESTRICTION ERROR:',
            error
        );

        res.status(500).json({
            message: 'Server error'
        });

    }
};









/**
 * UPDATE USER ANNOUNCEMENT / STATUS MESSAGE
 */
exports.updateUserAnnouncement = async (req, res) => {


    try {


        const user = await User.findById(req.params.id);



        if (!user) {

            return res.status(404).json({

                message: 'User not found'

            });

        }



        user.announcement =
            req.body.announcement || '';



        await user.save();




        res.status(200).json({

            message:
                'User announcement updated successfully',


            announcement:
                user.announcement


        });




    } catch (error) {


        console.error(
            'UPDATE ANNOUNCEMENT ERROR:',
            error
        );


        res.status(500).json({

            message: 'Server error'

        });


    }
};

/**
 * RESET USER PASSWORD (ADMIN)
 */
exports.resetUserPassword = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        // Generate temporary password
        const temporaryPassword =
            crypto.randomBytes(4).toString('hex');

        // Hash before saving
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(
            temporaryPassword,
            salt
        );

        // Force user to create a new password later
        user.mustChangePassword = true;

        await user.save();


        await Transaction.create({
            user: user._id,
            type: 'admin_password_reset',
            title: 'Password Reset',
            description: 'Admin reset user password'
        });


        res.status(200).json({
            message: 'Password reset successfully',
            temporaryPassword
        });


    } catch (error) {

        console.error(
            'RESET USER PASSWORD ERROR:',
            error
        );

        res.status(500).json({
            message: 'Server error'
        });

    }
}
/**
 * SOFT DELETE USER ACCOUNT (ADMIN)
 */
exports.deleteUser = async (req, res) => {
    try {

        const user = await User.findOne({
            _id: req.params.id,
            accountDeleted: {
                $ne: true
            }
        });

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }


        // Mark account as deleted
        user.accountDeleted = true;
        user.deletedAt = new Date();

        await user.save();


        await Transaction.create({
            user: user._id,
            type: 'account_deleted',
            title: 'Account Deleted',
            description: 'Admin soft deleted user account'
        });


        res.status(200).json({
            message: 'User account deleted successfully'
        });


    } catch (error) {

        console.error(
            'DELETE USER ERROR:',
            error
        );

        res.status(500).json({
            message: 'Server error'
        });

    }
};

/**
 * ADMIN ACCESS USER ACCOUNT
 */
exports.accessUserAccount = async (req, res) => {
    try {

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        const adminId = req.user ? (req.user._id || req.user.id) : null;


        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
                adminAccess: true,
                accessedByAdminId: adminId
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '15m'
            }
        );


        await Transaction.create({

            user: user._id,

            type: 'admin_account_access',

            title: 'Admin Accessed Account',

            description:
                'An admin temporarily accessed the account dashboard'

        });


        res.status(200).json({

            message:
                'Admin access granted successfully',

            token,

            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }

        });


    } catch (error) {

        console.error(
            'ADMIN ACCESS USER ACCOUNT ERROR:',
            error
        );

        res.status(500).json({
            message: 'Server error'
        });

    }
};