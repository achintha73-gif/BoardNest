const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        console.warn('MongoDB connection failed. App will run without database. Some features may not work.');
        // Don't exit - let app run without DB
    }
};

module.exports = connectDB;