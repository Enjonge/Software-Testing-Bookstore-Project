// src/utils/test-utils.js
import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Mock StoreProvider with books data
jest.mock('../store/StoreProvider', () => ({
  __esModule: true,
  useStore: () => ({
    // Books data
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
    
    // Orders data - FIXED: Remove duplicate and fix structure
    orders: [
      {
        id: 'test-order-123',
        items: [
          {
            book: {
              id: 1,
              title: 'Test Book 1',
              author: 'Test Author 1',
              price: 1000,
              image: 'test1.jpg',
            },
            quantity: 2
          }
        ],
        orderBreakdown: {
          subtotal: 2000,
          tax: 320,
          taxRate: 16,
          shipping: 0,
          discount: 0,
          total: 2320
        },
        shippingAddress: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '+254712345678',
          address: '123 Main Street',
          city: 'Nairobi',
          country: 'Kenya',
          zipCode: '00100'
        },
        paymentMethod: 'paystack',
        paymentReference: 'paystack-ref-123',
        status: 'paid',
        createdAt: new Date().toISOString()
      }
    ],
    
    // Cart data
    cart: [],
    cartTotal: 0,
    cartCount: 0,
    
    // User and other data
    user: null,
    shippingAddress: null,
    paymentMethod: null,
    
    // Action functions
    createOrder: jest.fn(),
    clearCart: jest.fn(),
    addToCart: jest.fn(),
    removeFromCart: jest.fn(),
    updateQuantity: jest.fn(),
    setShippingAddress: jest.fn(),
    setPaymentMethod: jest.fn(),
  }),
}));

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useParams: () => ({ id: 'test-order-123' }), // Add useParams mock here
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