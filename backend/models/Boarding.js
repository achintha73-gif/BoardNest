const mongoose = require('mongoose');

const boardingSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    facilities: [{ type: String }],
    images: [{ type: String }],
    contactNumber: { type: String, required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ownerName: { type: String },
    roomType: { type: String },
    availableRooms: { type: Number },
    deposit: { type: Number },
    nearby: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Boarding', boardingSchema);