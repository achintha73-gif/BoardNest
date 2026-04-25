let favorites = [];

const addFavorite = async (req, res) => {
    try {
        const { boardingId } = req.body;
        const userId = req.user._id.toString();
        const existing = favorites.find(f => f.userId === userId && f.boardingId === boardingId);
        if (existing) return res.status(400).json({ message: 'Already in favorites' });
        favorites.push({ userId, boardingId, addedAt: new Date() });
        res.json({ message: 'Added to favorites' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getFavorites = async (req, res) => {
    try {
        const userId = req.user._id.toString();
        const userFavorites = favorites.filter(f => f.userId === userId);
        const Boarding = require('../models/Boarding');
        const favoriteBoardings = [];
        for (let fav of userFavorites) {
            const boarding = await Boarding.findById(fav.boardingId);
            if (boarding) favoriteBoardings.push(boarding);
        }
        res.json({ favorites: favoriteBoardings });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addFavorite, getFavorites };