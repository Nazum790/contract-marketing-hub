const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');

const {
    activateContract,
    rejectContract,
    completeContract,
    creditCompletedContract,
    getPendingContracts,
    getActiveContracts,
    getCompletedContracts,
    getAllUsers,
} = require('../controllers/admin.contract.controller');

// 🔐 Protect all admin contract routes
router.use(authMiddleware, adminMiddleware);

/**
 * =========================
 * CONTRACT LISTS
 * =========================
 */

// GET /api/admin/contracts/pending
router.get('/pending', getPendingContracts);

// GET /api/admin/contracts/active
router.get('/active', getActiveContracts);

// GET /api/admin/contracts/completed
// ✅ completed BUT NOT credited
router.get('/completed', getCompletedContracts);

/**
 * =========================
 * CONTRACT ACTIONS
 * =========================
 */

// POST /api/admin/contracts/:id/activate
router.post('/:id/activate', activateContract);

// POST /api/admin/contracts/:id/reject
router.post('/:id/reject', rejectContract);

// POST /api/admin/contracts/:id/complete
router.post('/:id/complete', completeContract);

// POST /api/admin/contracts/:id/credit
router.post('/:id/credit', creditCompletedContract);

/**
 * =========================
 * USERS
 * =========================
 */

// GET /api/admin/contracts/users
router.get('/users', getAllUsers);

module.exports = router;