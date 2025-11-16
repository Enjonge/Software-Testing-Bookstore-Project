import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on app load
  useEffect(() => {
    const token = localStorage.getItem('bookstore_token');
    const userData = localStorage.getItem('bookstore_user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('bookstore_token');
        localStorage.removeItem('bookstore_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Trim and validate input
    const trimmedEmail = email ? email.trim() : '';
    const trimmedPassword = password ? password.trim() : '';

    // Basic validation
    if (!trimmedEmail || !trimmedPassword) {
      return { success: false, error: 'Please enter both email and password' };
    }

    if (!trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      return { success: false, error: 'Please enter a valid email address' };
    }

    if (trimmedPassword.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long' };
    }

    // Mock "database" of test users
    const testUsers = [
      { email: 'test@example.com', password: 'password123', name: 'Test User' },
      { email: 'admin@bookstore.com', password: 'admin123', name: 'Admin User' },
      { email: 'demo@example.com', password: 'demo123', name: 'Demo User' }
    ];

    const user = testUsers.find(u => 
      u.email === trimmedEmail && u.password === trimmedPassword
    );
    
    if (user) {
      const userData = {
        id: Date.now(),
        email: user.email,
        name: user.name,
        token: 'mock_jwt_token_' + Date.now()
      };
      
      localStorage.setItem('bookstore_token', userData.token);
      localStorage.setItem('bookstore_user', JSON.stringify(userData));
      setUser(userData);
      return { success: true, user: userData };
    } else {
      return { success: false, error: 'Invalid email or password. Please try again.' };
    }
  };

  const register = async (email, password, name) => {
    // Trim and validate input
    const trimmedEmail = email ? email.trim() : '';
    const trimmedPassword = password ? password.trim() : '';
    const trimmedName = name ? name.trim() : '';

    // Basic validation
    if (!trimmedEmail || !trimmedPassword || !trimmedName) {
      return { success: false, error: 'All fields are required' };
    }

    if (!trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      return { success: false, error: 'Please enter a valid email address' };
    }

    if (trimmedPassword.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long' };
    }

    if (trimmedName.length < 2) {
      return { success: false, error: 'Please enter your full name' };
    }

    // Mock "database" to check for existing users
    const existingUsers = JSON.parse(localStorage.getItem('bookstore_users') || '[]');
    const userExists = existingUsers.find(u => u.email === trimmedEmail);
    
    if (userExists) {
      return { success: false, error: 'An account with this email address already exists' };
    }

    // Create new user
    const userData = {
      id: Date.now(),
      email: trimmedEmail,
      name: trimmedName,
      token: 'mock_jwt_token_' + Date.now()
    };

    // Store in mock "database"
    const newUser = { 
      email: trimmedEmail, 
      password: trimmedPassword, 
      name: trimmedName 
    };
    existingUsers.push(newUser);
    localStorage.setItem('bookstore_users', JSON.stringify(existingUsers));
    localStorage.setItem('bookstore_token', userData.token);
    localStorage.setItem('bookstore_user', JSON.stringify(userData));
    setUser(userData);
    
    return { success: true, user: userData };
  };

  const logout = () => {
    localStorage.removeItem('bookstore_token');
    localStorage.removeItem('bookstore_user');
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};