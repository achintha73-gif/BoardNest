const express = require('express');
const {
    getBoardings,
    getBoardingById,
    createBoarding,
    updateBoarding,
    deleteBoarding,
    getOwnerBoardings
} = require('../controllers/boardingController');
const { protect, ownerOnly } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', getBoardings);
router.get('/owner', protect, ownerOnly, getOwnerBoardings);
router.get('/:id', getBoardingById);
router.post('/', protect, ownerOnly, createBoarding);
router.put('/:id', protect, ownerOnly, updateBoarding);
router.delete('/:id', protect, ownerOnly, deleteBoarding);

module.exports = router;