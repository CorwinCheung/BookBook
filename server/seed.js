const mongoose = require('mongoose');
const dotenv = require('dotenv');
const BookList = require('./models/BookList');
const Profile = require('./models/Profile');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bookbook', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB for seeding'))
.catch(err => console.error('Could not connect to MongoDB:', err));

// Initial data based on the current HTML content
const initialData = [
  {
    owner: "Corwin",
    books: [
      { title: "Norwegian Wood", author: "Haruki Murakami" },
      { title: "So Good They Can't Ignore You", author: "Cal Newport" },
      { title: "Thinking in Bets", author: "Annie Duke" },
      { title: "Doing Good Better", author: "William MacAskill" },
      { title: "Deep Thinking", author: "Garry Kasparov" }
    ]
  },
  {
    owner: "Alex",
    books: [
      { title: "A Short History of Nearly Everything", author: "Bill Bryson" },
      { title: "Poor Economics", author: "Abhijit V. Banerjee" },
      { title: "Burn Rate", author: "Andy Dunn" },
      { title: "Alexander Hamilton", author: "Ron Chernow" },
      { title: "A Brief History of Time", author: "Stephen Hawking" }
    ]
  },
  {
    owner: "Zakarias",
    books: [
      { title: "Deep Learning", author: "Ian Goodfellow" },
      { title: "Dune Messiah", author: "Frank Herbert" },
      { title: "The Alchemist", author: "Paulo Coelho" },
      { title: "Catch-22", author: "Joseph Heller" },
      { title: "A Brief History of Equality", author: "Thomas Piketty" }
    ]
  },
  {
    owner: "Rajan",
    books: [
      { title: "Capitalism and Freedom", author: "Milton Friedman" },
      { title: "Dracula", author: "Bram Stoker" },
      { title: "Play Nice But Win", author: "Michael Dell" },
      { title: "Sea of Tranquility", author: "Emily St John Mandel" },
      { title: "Unbroken", author: "Laura Hillenbrand" }
    ]
  },
  {
    owner: "Cass",
    books: [
      { title: "Anxious People", author: "Fredrik Backman" },
      { title: "The Shadow of the Wind", author: "Carlos Ruiz" },
      { title: "The Dark Forest", author: "Cixin Liu" },
      { title: "The Adventures of Huckleberry Finn", author: "Mark Twain" },
      { title: "The Odyssey", author: "Homer" }
    ]
  },
  {
    owner: "Jane",
    books: [
      { title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
      { title: "Pride and Prejudice", author: "Jane Austen" },
      { title: "1984", author: "George Orwell" },
      { title: "To Kill a Mockingbird", author: "Harper Lee" },
      { title: "The Catcher in the Rye", author: "J.D. Salinger" }
    ]
  }
];

// Seed function
const seedDatabase = async () => {
  try {
    // Clear existing data
    await BookList.deleteMany({});
    await Profile.deleteMany({});
    console.log('Cleared existing book lists and profiles');

    // Create book lists
    await BookList.insertMany(initialData);
    
    // Create profiles for each owner
    const profiles = initialData.map(data => ({
      owner: data.owner,
      bio: '',  // Default empty bio
      profilePicture: null  // Default no profile picture
    }));
    
    await Profile.insertMany(profiles);
    
    console.log('Database seeded successfully');

    // Disconnect from MongoDB
    mongoose.disconnect();
    console.log('MongoDB disconnected');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase(); 