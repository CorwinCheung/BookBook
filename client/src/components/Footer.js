import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-0 mt-0">
      <div className="container">
        <p className="mb-0">
          Copyright &copy; {new Date().getFullYear()} BookBook | Tech Lead:{' '}
          <a
            href="https://www.linkedin.com/in/corwincubes/"
            className="text-warning text-decoration-none"
            target="_blank"
            rel="noopener noreferrer"
          >
            Corwin Cheung
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer; 