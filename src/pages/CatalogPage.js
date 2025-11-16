import React, { useMemo, useState } from 'react';
import { useStore } from '../store/StoreProvider';
import { formatCurrency } from '../config/currency';

const CatalogPage = () => {
  const { books, addToCart } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCartNotification, setShowCartNotification] = useState(false);
  const [addedBookTitle, setAddedBookTitle] = useState('');

  // Filter books based on search query
  const filteredBooks = useMemo(() => {
    if (!searchQuery.trim()) return books;
    
    const query = searchQuery.toLowerCase();
    return books.filter(book => 
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      book.description.toLowerCase().includes(query)
    );
  }, [books, searchQuery]);

  const handleBuy = (book) => {
    // Actually add the book to cart
    addToCart(book, 1);
    
    // Show notification
    setAddedBookTitle(book.title);
    setShowCartNotification(true);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
      setShowCartNotification(false);
    }, 3000);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Cart Notification */}
      {showCartNotification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Added "{addedBookTitle}" to cart!</span>
          </div>
        </div>
      )}

      <div className="mb-8">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Our Collection</h2>
            <p className="text-gray-600">Discover amazing books from renowned authors</p>
          </div>
          <div className="w-full sm:w-80">
            <label htmlFor="search" className="sr-only">Search books</label>
            <input
              type="text"
              id="search"
              placeholder="Search books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-light text-gray-800"
            />
          </div>
        </div>
      </div>

      {/* Render books directly without BookList component */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredBooks.map((book) => (
          <div key={book.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <img
              src={book.image}
              alt={`${book.title} by ${book.author}`}
              className="w-full h-64 object-cover"
              loading="lazy"
            />
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2" data-testid="book-title">
                {book.title}
              </h3>
              <p className="text-gray-600 mb-2">by {book.author}</p>
              <p className="text-gray-700 text-sm mb-4">{book.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-primary-dark" data-testid="book-price">
                  {formatCurrency(book.price)}
                </span>
                <button
                  onClick={() => handleBuy(book)}
                  className="px-6 py-2 rounded-lg font-semibold transition-colors duration-200 bg-primary text-white hover:bg-primary-dark"
                  data-testid="book-buy-button"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No books found matching your search.</p>
          <button
            onClick={() => setSearchQuery('')}
            className="mt-4 text-primary hover:underline"
          >
            Clear search
          </button>
        </div>
      )}
    </main>
  );
};

export default CatalogPage;