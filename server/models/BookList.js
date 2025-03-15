const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  }
});

const BookListSchema = new mongoose.Schema({
  owner: {
    type: String,
    required: true,
    unique: true
  },
  books: [BookSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('BookList', BookListSchema); 