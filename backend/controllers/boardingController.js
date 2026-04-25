const Boarding = require('../models/Boarding');

const getBoardings = async (req, res) => {
    try {
        let query = {};
        if (req.query.location) {
            query.location = { $regex: req.query.location, $options: 'i' };
        }
        if (req.query.minPrice || req.query.maxPrice) {
            query.price = {};
            if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
            if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
        }
        if (req.query.facilities) {
            const facilities = Array.isArray(req.query.facilities)
                ? req.query.facilities
                : req.query.facilities.split(',').map(f => f.trim()).filter(Boolean);
            query.facilities = { $in: facilities };
        }
        const limit = Number(req.query.limit) || 50;
        const boardings = await Boarding.find(query).sort({ createdAt: -1 }).limit(limit);
        res.json({ boardings });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getBoardingById = async (req, res) => {
    try {
        const boarding = await Boarding.findById(req.params.id);
        if (!boarding) return res.status(404).json({ message: 'Not found' });
        res.json(boarding);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createBoarding = async (req, res) => {
    try {
        const { title, description, location, price, facilities, images, contactNumber, roomType, availableRooms, deposit, nearby } = req.body;
        const boarding = await Boarding.create({
            title, description, location, price,
            facilities: facilities || [],
            images: images || [],
            contactNumber,
            ownerId: req.user._id,
            ownerName: req.user.name,
            roomType,
            availableRooms,
            deposit,
            nearby
        });
        res.status(201).json(boarding);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateBoarding = async (req, res) => {
    try {
        const boarding = await Boarding.findById(req.params.id);
        if (!boarding) return res.status(404).json({ message: 'Not found' });
        if (boarding.ownerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        const updated = await Boarding.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteBoarding = async (req, res) => {
    try {
        const boarding = await Boarding.findById(req.params.id);
        if (!boarding) return res.status(404).json({ message: 'Not found' });
        if (boarding.ownerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        await boarding.deleteOne();
        res.json({ message: 'Deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOwnerBoardings = async (req, res) => {
    try {
        const boardings = await Boarding.find({ ownerId: req.user._id });
        res.json({ boardings });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getBoardings, getBoardingById, createBoarding, updateBoarding, deleteBoarding, getOwnerBoardings };