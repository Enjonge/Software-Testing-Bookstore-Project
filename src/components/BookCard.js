// src/components/BookCard.js - REPLACE WITH THIS
import React from 'react';
import { useStore } from '../store/StoreProvider';
import { formatCurrency } from '../config/currency';

const BookCard = ({ book }) => {
  const { addToCart } = useStore();

  const handleAddToCart = () => {
    addToCart(book);
  };

  return (
    <div className="book-card">
      <img src={book.image} alt={book.title} />
      <h3>{book.title}</h3>
      <p>by {book.author}</p>
      <p>{book.description}</p>
      <p>{formatCurrency(book.price)}</p>
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
};

export default BookCard;