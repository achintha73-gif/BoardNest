const express = require('express');
const { addFavorite, getFavorites } = require('../controllers/favoriteController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', protect, getFavorites);
router.post('/', protect, addFavorite);

module.exports = router;