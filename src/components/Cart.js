import React from 'react';
import { useStore } from '../store/StoreProvider';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cartCount } = useStore();

  return (
    <Link 
      to="/cart" 
      className="relative flex items-center text-gray-700 hover:text-primary transition-colors duration-200"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5.5M7 13l-2.5 5.5m0 0L17 21"></path>
      </svg>
      {cartCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
          {cartCount}
        </span>
      )}
      <span className="ml-2 hidden sm:inline">Cart</span>
    </Link>
  );
};

export default Cart;