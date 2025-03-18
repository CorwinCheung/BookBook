import React from 'react';
import { Link } from 'react-router-dom';

const BookCard = ({ owner, books, color }) => {
  // Define background colors for different owners
  const colors = {
    'Corwin': 'rgb(246, 107, 89)',
    'Alex': 'rgb(255, 155, 96)',
    'Zakarias': 'rgb(181, 198, 137)',
    'Rajan': 'rgb(67, 171, 201)',
    'Cass': 'rgb(120, 200, 240)',
    'Jane': 'rgb(239, 212, 105)'
  };

  const cardStyle = {
    backgroundColor: colors[owner] || color || '#f8f9fa',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    height: '100%',
    width: '100%'
  };

  const titleStyle = {
    fontSize: '1.2rem',
    textAlign: 'center',
    marginBottom: '15px'
  };

  const bookItemStyle = {
    backgroundColor: 'transparent',
    border: 'none',
    padding: '5px 0',
    textAlign: 'left',
    fontSize: '0.85rem',
    wordBreak: 'break-word'
  };

  return (
    <div className="book-list book-panel" style={cardStyle}>
      <div className="card-body">
        <h3 className="card-title mb-3" style={titleStyle}>{owner}'s Books!</h3>
        <ul className="list-group list-group-flush mb-3">
          {books && books.length > 0 ? (
            books.map((book, index) => (
              <li key={index} className="list-group-item" style={bookItemStyle}>
                {book.title} - {book.author}
              </li>
            ))
          ) : (
            <li className="list-group-item" style={bookItemStyle}>
              No books found
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default BookCard; 