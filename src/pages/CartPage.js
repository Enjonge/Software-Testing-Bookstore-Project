import React from 'react';
import { useStore } from '../store/StoreProvider';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../config/currency';

const CartPage = () => {
  const { cart, updateCartQuantity, removeFromCart } = useStore();

  const handleRemove = (bookId) => {
    if (!bookId) return;
    removeFromCart(bookId);
  };

  const handleDecrease = (bookId, currentQuantity) => {
    if (!bookId) return;
    
    if (currentQuantity > 1) {
      updateCartQuantity(bookId, currentQuantity - 1);
    } else {
      handleRemove(bookId);
    }
  };

  const handleIncrease = (bookId, currentQuantity) => {
    if (!bookId) return;
    updateCartQuantity(bookId, currentQuantity + 1);
  };

  // Calculate cart total
  const cartTotal = cart.reduce((total, item) => total + (item.book?.price || 0) * item.quantity, 0);

  // Empty cart state
  if (!cart || cart.length === 0) {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/catalog" 
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark font-semibold"
            >
              Browse Catalog
            </Link>
            <Link 
              to="/" 
              className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 font-semibold"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      <div className="space-y-4">
        {cart.map((item) => {
          if (!item || !item.book) return null;
          
          const bookId = item.book.id;
          const itemTotal = (item.book.price || 0) * item.quantity;
          
          return (
            <div key={bookId} className="flex justify-between items-center border p-4 rounded">
              <div className="flex-1">
                <h3 className="font-bold text-lg">{item.book.title}</h3>
                <p className="text-gray-600">by {item.book.author}</p>
                <p className="mt-2">Quantity: {item.quantity}</p>
                <p className="text-green-600 font-semibold">
                  {formatCurrency(itemTotal)}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDecrease(bookId, item.quantity)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 w-8 h-8 rounded flex items-center justify-center font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 border bg-white min-w-12 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleIncrease(bookId, item.quantity)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 w-8 h-8 rounded flex items-center justify-center font-bold"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => handleRemove(bookId)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-semibold"
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
        
        <div className="border-t pt-4 mt-6">
          <div className="flex justify-between items-center font-bold text-xl mb-4">
            <span>Total:</span>
            <span className="text-green-600">
              {formatCurrency(cartTotal)}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to="/catalog" 
              className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-dark font-semibold text-center"
            >
              Continue Shopping
            </Link>
            <Link 
              to="/" 
              className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 font-semibold text-center"
            >
              Go to Home
            </Link>
            <Link 
              to="/checkout" 
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 font-semibold text-center"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;