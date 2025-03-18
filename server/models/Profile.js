const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  owner: {
    type: String,
    required: true,
    unique: true
  },
  bio: {
    type: String,
    default: ''
  },
  profilePicture: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Profile', ProfileSchema); 