const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth.middleware');

// Contract controllers ONLY
const {
    getAllContracts,
    getContractById,
    requestContract,
    getMyContracts
} = require('../controllers/contract.controller');

/*
|--------------------------------------------------------------------------
| USER CONTRACTS
|--------------------------------------------------------------------------
*/

// Get user's contracts
router.get('/my', authMiddleware, getMyContracts);

// Request a contract
router.post('/request', authMiddleware, requestContract);

/*
|--------------------------------------------------------------------------
| CONTRACT PLANS
|--------------------------------------------------------------------------
*/

// Get all contract plans
router.get('/', authMiddleware, getAllContracts);

// Get single contract plan by ID
router.get('/:id', authMiddleware, getContractById);

module.exports = router;