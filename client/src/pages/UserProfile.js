import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserProfile = () => {
  const { owner } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    owner: '',
    books: [],
    bio: '',
    profilePicture: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newBook, setNewBook] = useState({ title: '', author: '' });
  const [editedBio, setEditedBio] = useState('');
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');

  // Hardcoded passwords for each profile
  const profilePasswords = {
    'Corwin': 'cheung',
    'Alex': 'Gerstenhaber',
    'Zakarias': 'Erdos',
    'Rajan': 'Bhargava',
    'Cass': 'Swartz',
    'Jane': 'Lichtman'
  };

  // Colors from the existing theme
  const colors = {
    'Corwin': 'rgb(246, 107, 89)',
    'Alex': 'rgb(255, 155, 96)',
    'Zakarias': 'rgb(181, 198, 137)',
    'Rajan': 'rgb(67, 171, 201)',
    'Cass': 'rgb(120, 200, 240)',
    'Jane': 'rgb(239, 212, 105)'
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/profiles/${owner}`);
        setProfile(response.data);
        setEditedBio(response.data.bio || '');
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch profile. Please try again later.');
        setLoading(false);
        console.error('Error fetching profile:', err);
      }
    };

    fetchProfile();
  }, [owner]);

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/profiles/${owner}/upload-photo`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setProfile({ ...profile, profilePicture: response.data.profilePicture });
      setSuccess('Profile picture updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to upload profile picture. Please try again.');
      console.error('Error uploading profile picture:', err);
    }
  };

  const handleBioSave = async () => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/profiles/${owner}`, {
        bio: editedBio
      });
      setProfile({ ...profile, bio: editedBio });
      setIsEditing(false);
      setSuccess('Bio updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to update bio. Please try again.');
      console.error('Error updating bio:', err);
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    if (newBook.title.trim() === '' || newBook.author.trim() === '') {
      setError('Please enter both title and author');
      return;
    }

    try {
      const updatedBooks = [...profile.books, newBook];
      await axios.put(`${process.env.REACT_APP_API_URL}/booklists/${owner}`, {
        books: updatedBooks
      });
      setProfile({ ...profile, books: updatedBooks });
      setNewBook({ title: '', author: '' });
      setSuccess('Book added successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to add book. Please try again.');
      console.error('Error adding book:', err);
    }
  };

  const handleRemoveBook = async (index) => {
    try {
      const updatedBooks = profile.books.filter((_, i) => i !== index);
      await axios.put(`${process.env.REACT_APP_API_URL}/booklists/${owner}`, {
        books: updatedBooks
      });
      setProfile({ ...profile, books: updatedBooks });
      setSuccess('Book removed successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to remove book. Please try again.');
      console.error('Error removing book:', err);
    }
  };

  const verifyPassword = () => {
    if (password === profilePasswords[owner]) {
      setIsEditMode(true);
      setShowPasswordModal(false);
      setPassword('');
      setSuccess('Edit mode enabled');
      setTimeout(() => setSuccess(null), 3000);
    } else {
      setError('Incorrect password');
      setTimeout(() => setError(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading profile...</p>
      </div>
    );
  }

  const profileStyle = {
    backgroundColor: colors[owner] || '#f8f9fa',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
  };

  const modalStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    cursor: 'pointer'
  };

  const modalImageStyle = {
    maxWidth: '90vw',
    maxHeight: '90vh',
    minWidth: '600px',
    minHeight: '600px',
    objectFit: 'contain',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
  };

  const passwordModalStyle = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    width: '300px',
    cursor: 'default'
  };

  return (
    <>
      {showPhotoModal && (
        <div 
          style={modalStyle} 
          onClick={() => setShowPhotoModal(false)}
          role="dialog"
          aria-label="Profile picture preview"
        >
          <img
            src={profile.profilePicture || '/images/default.png'}
            alt={`${owner}'s profile`}
            style={modalImageStyle}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {showPasswordModal && (
        <div 
          style={modalStyle} 
          onClick={() => setShowPasswordModal(false)}
          role="dialog"
          aria-label="Password verification"
        >
          <div 
            style={passwordModalStyle}
            onClick={(e) => e.stopPropagation()}
          >
            <h5 className="mb-3">Enter Password</h5>
            <input
              type="password"
              className="form-control mb-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  verifyPassword();
                }
              }}
            />
            <div className="d-flex gap-2 justify-content-end">
              <button
                className="btn btn-secondary"
                onClick={() => setShowPasswordModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={verifyPassword}
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="container py-4">
        <div className="row">
          <div className="col-md-4">
            <div className="card mb-4" style={profileStyle}>
              <div className="card-body text-center">
                <div className="mb-4">
                  <div className="mb-3">
                    <img
                      src={profile.profilePicture || '/images/default.png'}
                      alt={`${owner}'s profile`}
                      className="rounded-circle"
                      style={{ 
                        width: '150px', 
                        height: '150px', 
                        objectFit: 'cover',
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease-in-out'
                      }}
                      onClick={() => setShowPhotoModal(true)}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    />
                  </div>
                  {isEditMode && (
                    <>
                      <label
                        htmlFor="profile-picture-input"
                        className="btn btn-sm btn-dark"
                        style={{ cursor: 'pointer' }}
                      >
                        Change Photo
                      </label>
                      <input
                        id="profile-picture-input"
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePictureChange}
                        style={{ display: 'none' }}
                      />
                    </>
                  )}
                </div>
                <h3 className="mb-3">{owner}</h3>
                {isEditMode && isEditing ? (
                  <div className="mb-3">
                    <textarea
                      className="form-control"
                      value={editedBio}
                      onChange={(e) => setEditedBio(e.target.value)}
                      rows="4"
                      placeholder="Write something about yourself..."
                    />
                    <div className="mt-2">
                      <button
                        className="btn btn-success me-2"
                        onClick={handleBioSave}
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => {
                          setIsEditing(false);
                          setEditedBio(profile.bio || '');
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mb-3">
                    <p className="text-muted">
                      {profile.bio || 'No bio yet'}
                    </p>
                    {isEditMode && (
                      <button
                        className="btn btn-outline-dark"
                        onClick={() => setIsEditing(true)}
                      >
                        Edit Bio
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-md-8">
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

            <div className="card" style={profileStyle}>
              <div className="card-body">
                <h4 className="card-title mb-3">Books</h4>
                <div className="list-group">
                  {profile.books.length === 0 && !isAddingBook ? (
                    <p className="text-muted">No books added yet</p>
                  ) : (
                    <>
                      {profile.books.map((book, index) => (
                        <div
                          key={index}
                          className="list-group-item d-flex justify-content-between align-items-start"
                          style={{ 
                            backgroundColor: 'transparent',
                            padding: '12px 20px',
                            width: '100%'
                          }}
                        >
                          <div style={{ 
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start'
                          }}>
                            <div style={{ 
                              fontSize: '1rem',
                              fontWeight: '500',
                              marginBottom: '4px',
                              width: '100%',
                              textAlign: 'left'
                            }}>
                              {book.title}
                            </div>
                            <div style={{ 
                              fontSize: '0.875rem',
                              color: '#6c757d',
                              marginLeft: '1em',
                              width: '100%',
                              textAlign: 'left'
                            }}>
                              {book.author}
                            </div>
                          </div>
                          {isEditMode && (
                            <button
                              className="btn btn-sm btn-outline-danger ms-3"
                              onClick={() => handleRemoveBook(index)}
                              style={{ alignSelf: 'center', flexShrink: 0 }}
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      ))}
                    </>
                  )}
                  
                  {isEditMode && (
                    <>
                      {isAddingBook ? (
                        <div className="list-group-item" style={{ backgroundColor: 'transparent', padding: '12px 20px' }}>
                          <form onSubmit={handleAddBook} className="d-flex flex-column gap-2">
                            <input
                              type="text"
                              className="form-control mb-2"
                              placeholder="Book Title"
                              value={newBook.title}
                              onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                              required
                            />
                            <input
                              type="text"
                              className="form-control mb-3"
                              placeholder="Author"
                              value={newBook.author}
                              onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                              required
                            />
                            <div className="d-flex gap-2">
                              <button type="submit" className="btn btn-success">
                                Add Book
                              </button>
                              <button 
                                type="button" 
                                className="btn btn-secondary"
                                onClick={() => {
                                  setIsAddingBook(false);
                                  setNewBook({ title: '', author: '' });
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        </div>
                      ) : (
                        <div className="list-group-item" style={{ backgroundColor: 'transparent', padding: '12px 20px' }}>
                          <button
                            className="btn btn-dark w-100"
                            onClick={() => setIsAddingBook(true)}
                          >
                            Add New Book
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="position-fixed bottom-0 start-0 m-4">
          {!isEditMode ? (
            <button
              className="btn btn-primary"
              onClick={() => setShowPasswordModal(true)}
            >
              Edit Page
            </button>
          ) : (
            <button
              className="btn btn-secondary"
              onClick={() => {
                setIsEditMode(false);
                setIsEditing(false);
                setIsAddingBook(false);
                setSuccess('View mode enabled');
                setTimeout(() => setSuccess(null), 3000);
              }}
            >
              Exit Edit Mode
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default UserProfile; 