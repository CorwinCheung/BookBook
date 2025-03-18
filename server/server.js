const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Add CORS configuration before your routes
app.use(cors({
  origin: ['https://bookbook.page', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bookbook', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Import routes
const bookListRoutes = require('./routes/bookList');

// Use routes
app.use('/api/booklists', bookListRoutes);

// Remove all static file serving and catch-all route since frontend is on GitHub Pages

// Set port
const PORT = process.env.PORT || 5001;

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 