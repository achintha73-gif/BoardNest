const express = require('express');
const { registerUser, loginUser, deleteOwner, clearAllData } = require('../controllers/authController');
const { protect, ownerOnly } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.delete('/delete-account', protect, ownerOnly, deleteOwner);
router.post('/clear-all-data', clearAllData); // Development only - no auth required

module.exports = router;