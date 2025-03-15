const BookList = require('../models/BookList');

// Get all book lists
exports.getAllBookLists = async (req, res) => {
  try {
    const bookLists = await BookList.find();
    res.status(200).json(bookLists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single book list by owner
exports.getBookListByOwner = async (req, res) => {
  try {
    const bookList = await BookList.findOne({ owner: req.params.owner });
    
    if (!bookList) {
      return res.status(404).json({ message: 'Book list not found' });
    }
    
    res.status(200).json(bookList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new book list
exports.createBookList = async (req, res) => {
  try {
    const newBookList = new BookList({
      owner: req.body.owner,
      books: req.body.books || []
    });
    
    const savedBookList = await newBookList.save();
    res.status(201).json(savedBookList);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a book list
exports.updateBookList = async (req, res) => {
  try {
    const updatedBookList = await BookList.findOneAndUpdate(
      { owner: req.params.owner },
      { 
        books: req.body.books,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedBookList) {
      return res.status(404).json({ message: 'Book list not found' });
    }
    
    res.status(200).json(updatedBookList);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a book list
exports.deleteBookList = async (req, res) => {
  try {
    const deletedBookList = await BookList.findOneAndDelete({ owner: req.params.owner });
    
    if (!deletedBookList) {
      return res.status(404).json({ message: 'Book list not found' });
    }
    
    res.status(200).json({ message: 'Book list deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 