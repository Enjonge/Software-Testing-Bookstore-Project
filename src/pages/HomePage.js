// src/pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="home-page">
      <h1>Welcome to Our Bookstore</h1>
      <p>Discover amazing books in our collection</p>
      <Link to="/catalog">Browse Books</Link>
    </div>
  );
};

export default HomePage;