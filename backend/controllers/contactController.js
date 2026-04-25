const Contact = require('../models/Contact');

const sendContact = async (req, res) => {
    try {
        const { receiverId, boardingTitle, message } = req.body;
        const contact = await Contact.create({
            sender: req.user._id,
            receiver: receiverId,
            boardingTitle,
            message
        });
        res.status(201).json(contact);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getStudentContacts = async (req, res) => {
    try {
        const userId = req.user._id;
        const contacts = await Contact.find({
            $or: [{ sender: userId }, { receiver: userId }]
        })
        .populate('sender', 'name')
        .populate('receiver', 'name')
        .sort('-createdAt');
        res.json({ contacts });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOwnerContacts = async (req, res) => {
    try {
        const userId = req.user._id;
        const contacts = await Contact.find({
            $or: [{ sender: userId }, { receiver: userId }]
        })
        .populate('sender', 'name')
        .populate('receiver', 'name')
        .sort('-createdAt');
        res.json({ contacts });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { sendContact, getStudentContacts, getOwnerContacts };