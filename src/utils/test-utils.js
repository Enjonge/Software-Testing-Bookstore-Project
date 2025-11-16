// src/utils/test-utils.js
import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Mock the books data that StoreProvider imports
jest.mock('../data/books', () => [
  {
    id: 1,
    title: 'Test Book 1',
    author: 'Test Author 1',
    price: 1000,
    image: 'test1.jpg',
    description: 'Test description 1',
    category: 'fiction'
  },
  {
    id: 2,
    title: 'Test Book 2', 
    author: 'Test Author 2',
    price: 1500,
    image: 'test2.jpg',
    description: 'Test description 2',
    category: 'non-fiction'
  }
]);

// Mock StoreProvider with the exact structure from StoreProvider.js
jest.mock('../store/StoreProvider', () => ({
  useStore: () => ({
    // State properties (from getInitialState and computed values)
    books: [
      {
        id: 1,
        title: 'Test Book 1',
        author: 'Test Author 1',
        price: 1000,
        image: 'test1.jpg',
        description: 'Test description 1',
        category: 'fiction'
      },
      {
        id: 2,
        title: 'Test Book 2', 
        author: 'Test Author 2',
        price: 1500,
        image: 'test2.jpg',
        description: 'Test description 2',
        category: 'non-fiction'
      }
    ],
    cart: [],
    cartTotal: 0,
    cartCount: 0,
    orders: [],
    user: null,
    shippingAddress: null,
    paymentMethod: null,
    // In the useStore mock, add orders data:
orders: [
  {
    id: '123',
    items: [],
    total: 0,
    status: 'completed',
    createdAt: new Date().toISOString()
  }
],
    
    // Action functions
    addToCart: jest.fn(),
    removeFromCart: jest.fn(),
    updateCartQuantity: jest.fn(),
    clearCart: jest.fn(),
    setShippingAddress: jest.fn(),
    setPaymentMethod: jest.fn(),
    createOrder: jest.fn(),
  }),
}));

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

// Mock currency format
jest.mock('../config/currency', () => ({
  formatCurrency: (amount) => `KSh ${amount}`,
}));

const AllTheProviders = ({ children }) => {
  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  );
};

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };