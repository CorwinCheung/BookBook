const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

// Get profile by owner
router.get('/:owner', profileController.getProfile);

// Update profile
router.put('/:owner', profileController.updateProfile);

// Upload profile picture
router.post('/:owner/upload-photo', profileController.uploadProfilePicture);

module.exports = router; 