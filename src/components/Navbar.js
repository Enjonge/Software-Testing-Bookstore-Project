import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/StoreProvider';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { cartCount } = useStore();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo on the left */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary">BookStore</span>
          </Link>

          {/* Desktop Navigation - aligned to the right */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-primary transition-colors duration-200 font-medium"
            >
              Home
            </Link>
            <Link 
              to="/catalog" 
              className="text-gray-700 hover:text-primary transition-colors duration-200 font-medium"
            >
              Catalog
            </Link>
            <Link 
              to="/admin" 
              className="text-gray-700 hover:text-primary transition-colors duration-200 font-medium"
            >
              Admin
            </Link>
            
            {/* NEW: Authentication Links - Added after existing links */}
            {user ? (
              <button 
                onClick={handleLogout}
                className="text-gray-700 hover:text-primary transition-colors duration-200 font-medium"
              >
                Logout
              </button>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-primary transition-colors duration-200 font-medium"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="text-gray-700 hover:text-primary transition-colors duration-200 font-medium"
                >
                  Register
                </Link>
              </>
            )}
            
            {/* Single Cart Link with count - EXISTING CODE */}
            <Link 
              to="/cart" 
              className="text-gray-700 hover:text-primary transition-colors duration-200 font-medium flex items-center relative"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5.5M7 13l-2.5 5.5m0 0L17 21"></path>
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile menu button and cart - EXISTING CODE */}
          <div className="flex items-center space-x-4 md:hidden">
            {/* Cart for mobile */}
            <Link 
              to="/cart" 
              className="text-gray-700 hover:text-primary transition-colors duration-200 flex items-center relative"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5.5M7 13l-2.5 5.5m0 0L17 21"></path>
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="text-gray-700 hover:text-primary focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link 
                to="/" 
                className="block px-3 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/catalog" 
                className="block px-3 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Catalog
              </Link>
              <Link 
                to="/admin" 
                className="block px-3 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin
              </Link>
              
              {/* NEW: Mobile Authentication Links - Added after existing links */}
              {user ? (
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md font-medium"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="block px-3 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="block px-3 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
              
              <Link 
                to="/cart" 
                className="block px-3 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md font-medium flex items-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Cart
                {cartCount > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;