const User = require('../models/User');
const Boarding = require('../models/Boarding');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const user = await User.create({ name, email, password, role });
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteOwner = async (req, res) => {
    try {
        const userId = req.user._id;
        
        // Delete all boardings owned by this user
        await Boarding.deleteMany({ ownerId: userId });
        
        // Delete the user account
        await User.findByIdAndDelete(userId);
        
        res.json({ message: 'Owner account and all boardings deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const clearAllData = async (req, res) => {
    try {
        // Clear all boardings
        await Boarding.deleteMany({});
        
        // Clear all users
        await User.deleteMany({});
        
        res.json({ message: 'All data cleared successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser, deleteOwner, clearAllData };