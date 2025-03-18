const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Initialize Express app
const app = express();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
const profilePicturesDir = path.join(uploadsDir, 'profile-pictures');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
if (!fs.existsSync(profilePicturesDir)) {
  fs.mkdirSync(profilePicturesDir);
}

// Middleware
app.use(cors({
  origin: ['https://bookbook.page', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bookbook', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB:', err));

// Import routes
const bookListRoutes = require('./routes/bookList');
const profileRoutes = require('./routes/profile');

// Use routes
app.use('/api/booklists', bookListRoutes);
app.use('/api/profiles', profileRoutes);

// Remove all static file serving and catch-all route since frontend is on GitHub Pages

// Set port
const PORT = process.env.PORT || 5001;

// Start server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));