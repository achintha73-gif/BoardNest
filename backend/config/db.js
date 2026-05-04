const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });

const connectDB = async () => {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error('MONGODB_URI is not defined. Please add it to the .env file at the project root.');
        process.exit(1);
    }

    try {
        const conn = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 10000,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB connection failed: ${error.message}`);
        if (error.message.includes('querySrv')) {
            console.error('Atlas DNS SRV lookup failed. This usually means your machine cannot resolve the cluster host or DNS SRV queries are blocked.');
            console.error('Try one of these fixes:');
            console.error('- Add your current IP address to Atlas Network Access');
            console.error('- Ensure your network/DNS server can resolve cluster0.xxxxx.mongodb.net');
            console.error('- Use the non-SRV Atlas connection string from Atlas if necessary');
        } else {
            console.error('Verify your Atlas IP whitelist, credentials, and network access.');
        }
        process.exit(1);
    }
};

module.exports = connectDB;