const Profile = require('../models/Profile');
const BookList = require('../models/BookList');
const multer = require('multer');
const path = require('path');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/profile-pictures');
  },
  filename: function (req, file, cb) {
    cb(null, `${req.params.owner}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
  }
}).single('profilePicture');

// Get profile by owner
exports.getProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne({ owner: req.params.owner });
    const bookList = await BookList.findOne({ owner: req.params.owner });

    if (!profile) {
      // Create a new profile if it doesn't exist
      profile = new Profile({ owner: req.params.owner });
      await profile.save();
    }

    // Combine profile and booklist data
    const response = {
      ...profile.toObject(),
      books: bookList ? bookList.books : []
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      { owner: req.params.owner },
      {
        ...req.body,
        updatedAt: Date.now()
      },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json(profile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Upload profile picture
exports.uploadProfilePicture = async (req, res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: 'File upload error' });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ message: 'Please upload a file' });
      }

      const profile = await Profile.findOneAndUpdate(
        { owner: req.params.owner },
        {
          profilePicture: `/uploads/profile-pictures/${req.file.filename}`,
          updatedAt: Date.now()
        },
        { new: true, upsert: true }
      );

      res.status(200).json(profile);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
}; 