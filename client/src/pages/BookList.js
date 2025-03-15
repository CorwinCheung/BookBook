import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BookList = () => {
  const { owner } = useParams();
  const navigate = useNavigate();
  const [bookList, setBookList] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [newBook, setNewBook] = useState({ title: '', author: '' });

  // Define background colors for different owners
  const colors = {
    'Corwin': 'rgb(246, 107, 89)',
    'Alex': 'rgb(255, 155, 96)',
    'Zakarias': 'rgb(181, 198, 137)',
    'Rajan': 'rgb(67, 171, 201)',
    'Cass': 'rgb(120, 200, 240)',
    'Jane': 'rgb(239, 212, 105)'
  };

  useEffect(() => {
    const fetchBookList = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/booklists/${owner}`);
        setBookList(response.data);
        setBooks(response.data.books);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch book list. Please try again later.');
        setLoading(false);
        console.error('Error fetching book list:', err);
      }
    };

    fetchBookList();
  }, [owner]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBook({ ...newBook, [name]: value });
  };

  const handleAddBook = (e) => {
    e.preventDefault();
    if (newBook.title.trim() === '' || newBook.author.trim() === '') {
      setError('Please enter both title and author');
      return;
    }

    setBooks([...books, newBook]);
    setNewBook({ title: '', author: '' });
    setError(null);
    setSuccess('Book added successfully!');

    setTimeout(() => {
      setSuccess(null);
    }, 3000);
  };

  const handleRemoveBook = (index) => {
    const updatedBooks = [...books];
    updatedBooks.splice(index, 1);
    setBooks(updatedBooks);
  };

  const handleSaveBooks = async () => {
    try {
      await axios.put(`http://localhost:5001/api/booklists/${owner}`, {
        books: books
      });
      setSuccess('Book list saved successfully!');
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      setError('Failed to save book list. Please try again later.');
      console.error('Error saving book list:', err);
    }
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading book list...</p>
      </div>
    );
  }

  if (error && !bookList) {
    return (
      <div className="alert alert-danger my-5" role="alert">
        {error}
      </div>
    );
  }

  const cardStyle = {
    backgroundColor: colors[owner] || '#f8f9fa',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{owner}'s Books</h2>
        <button className="btn btn-outline-secondary" onClick={() => navigate('/')}>
          Back to Home
        </button>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success" role="alert">
          {success}
        </div>
      )}

      <div className="card mb-4" style={cardStyle}>
        <div className="card-body">
          <h3 className="card-title mb-3">Add a New Book</h3>
          <form onSubmit={handleAddBook}>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">
                Book Title
              </label>
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                value={newBook.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="author" className="form-label">
                Author
              </label>
              <input
                type="text"
                className="form-control"
                id="author"
                name="author"
                value={newBook.author}
                onChange={handleInputChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-dark">
              Add Book
            </button>
          </form>
        </div>
      </div>

      <div className="card" style={cardStyle}>
        <div className="card-body">
          <h3 className="card-title mb-3">Current Books</h3>
          {books.length === 0 ? (
            <p>No books in this list yet.</p>
          ) : (
            <ul className="list-group list-group-flush mb-3">
              {books.map((book, index) => (
                <li
                  key={index}
                  className="list-group-item d-flex justify-content-between align-items-center"
                  style={{ backgroundColor: 'transparent', border: 'none' }}
                >
                  <div>
                    <span className="text-warning me-2">★</span>
                    {book.title} - {book.author}
                  </div>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleRemoveBook(index)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
          <button className="btn btn-success" onClick={handleSaveBooks}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookList; 