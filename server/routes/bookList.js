const express = require('express');
const router = express.Router();
const bookListController = require('../controllers/bookListController');

// GET all book lists
router.get('/', bookListController.getAllBookLists);

// GET a single book list by owner
router.get('/:owner', bookListController.getBookListByOwner);

// POST a new book list
router.post('/', bookListController.createBookList);

// PUT (update) a book list
router.put('/:owner', bookListController.updateBookList);

// DELETE a book list
router.delete('/:owner', bookListController.deleteBookList);

module.exports = router; 