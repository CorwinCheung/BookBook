import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookCard from '../components/BookCard';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [bookLists, setBookLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookLists = async () => {
      try {
        const response = await axios.get('https://bookbook.page/api/booklists');
        setBookLists(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch book lists. Please try again later.');
        setLoading(false);
        console.error('Error fetching book lists:', err);
      }
    };

    fetchBookLists();
  }, []);

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading book lists...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger my-5" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="banner-container">
        <img 
          src="/images/banner-2.jpg" 
          alt="Mountain landscape" 
          className="banner-image"
        />
        
        <div className="banner-overlay">
          <div className="title-container">
            <h1><span className="book-green">Book</span><span className="book-red">Book</span></h1>
            <p>List your books and see what your friends have listed</p>
          </div>
        </div>
      </div>
      
      <div className="cozy-background">
        <div className="content-container">
          <div className="book-lists-container">
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-5">
              {bookLists.map((bookList) => (
                <div className="col" key={bookList._id}>
                  <BookCard
                    owner={bookList.owner}
                    books={bookList.books}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 