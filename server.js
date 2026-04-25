const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./backend/config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', require('./backend/routes/authRoutes'));
app.use('/api/boardings', require('./backend/routes/boardingRoutes'));
app.use('/api/favorites', require('./backend/routes/favoriteRoutes'));
app.use('/api/contacts', require('./backend/routes/contactRoutes'));

// API 404 handler
app.use('/api', (req, res) => {
    res.status(404).json({ message: 'API endpoint not found' });
});

// Frontend SPA handler
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const basePort = parseInt(process.env.PORT, 10) || 5000;
const maxRetries = 5;

function startServer(port, attempt = 1) {
    const server = app.listen(port, () => {
        console.log(`Server running on port ${port}`);
        console.log(`Frontend: http://localhost:${port}`);
        console.log(`API: http://localhost:${port}/api`);
    });

    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.warn(`Port ${port} in use. Attempting next port... (${attempt}/${maxRetries})`);
            if (attempt < maxRetries) {
                startServer(port + 1, attempt + 1);
            } else {
                console.error(`Failed to bind HTTP server after ${maxRetries} attempts.`);
                process.exit(1);
            }
        } else {
            console.error('Server error:', err);
            process.exit(1);
        }
    });
}

startServer(basePort);