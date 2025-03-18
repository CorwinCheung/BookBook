import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const BookCard = ({ owner, books, color }) => {
  const navigate = useNavigate();
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
    width: '100%',
    cursor: 'pointer',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out'
  };

  const titleStyle = {
    fontSize: '1.2rem',
    textAlign: 'center',
    marginBottom: '15px',
    cursor: 'pointer',
    transition: 'text-decoration 0.2s ease-in-out'
  };

  const titleLinkStyle = {
    color: 'inherit',
    textDecoration: 'none',
    display: 'inline-block',
    position: 'relative'
  };

  const bookItemStyle = {
    backgroundColor: 'transparent',
    border: 'none',
    padding: '5px 0',
    textAlign: 'left',
    fontSize: '0.85rem',
    wordBreak: 'break-word'
  };

  const handleClick = () => {
    navigate(`/profile/${owner}`);
  };

  const handleTitleClick = (e) => {
    e.stopPropagation(); // Prevent card click from triggering
    navigate(`/profile/${owner}`);
  };

  return (
    <div 
      className="book-list book-panel" 
      style={cardStyle} 
      onClick={handleClick}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
      }}
    >
      <div className="card-body">
        <h3 className="card-title mb-3" style={titleStyle}>
          <span
            style={titleLinkStyle}
            onClick={handleTitleClick}
            onMouseOver={(e) => {
              e.currentTarget.style.textDecoration = 'underline';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.textDecoration = 'none';
            }}
          >
            {owner}'s Books!
          </span>
        </h3>
        <ul className="list-group list-group-flush mb-3">
          {books && books.length > 0 ? (
            books.slice(0, 5).map((book, index) => (
              <li key={index} className="list-group-item" style={bookItemStyle}>
                {book.title} - {book.author}
              </li>
            ))
          ) : (
            <li className="list-group-item" style={bookItemStyle}>
              No books found
            </li>
          )}
          {books && books.length > 5 && (
            <li className="list-group-item" style={bookItemStyle}>
              <em>and {books.length - 5} more...</em>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default BookCard; 