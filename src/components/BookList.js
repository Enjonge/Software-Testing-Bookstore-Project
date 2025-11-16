import React from 'react';
import BookCard from './BookCard';

const BookList = ({ books, onPurchase }) => {
  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No books found matching your search.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {books.map(book => (
        <BookCard key={book.id} book={book} onPurchase={onPurchase} />
      ))}
    </div>
  );
};

// Add this default export
export default BookList;