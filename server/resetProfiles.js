const mongoose = require('mongoose');
const Profile = require('./models/Profile');
require('dotenv').config();

async function resetProfilePictures() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const result = await Profile.updateMany(
      {},
      { $set: { profilePicture: null } }
    );
    
    console.log('Reset profile pictures:', result);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

resetProfilePictures(); 