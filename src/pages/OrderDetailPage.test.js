// src/pages/OrderDetailPage.test.js - No mocks version
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StoreProvider } from '../store/StoreProvider';
import OrderDetailPage from './OrderDetailPage';

// Create a simple test wrapper
const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <StoreProvider>
      {children}
    </StoreProvider>
  </BrowserRouter>
);

describe('OrderDetailPage', () => {
  test('renders order not found by default', () => {
    render(
      <TestWrapper>
        <OrderDetailPage />
      </TestWrapper>
    );
    
    // Since no order ID is provided and store is empty, should show not found
    expect(screen.getByText('Order Not Found')).toBeInTheDocument();
  });

  test('provides continue shopping link', () => {
    render(
      <TestWrapper>
        <OrderDetailPage />
      </TestWrapper>
    );
    
    expect(screen.getByText('Continue Shopping')).toBeInTheDocument();
  });
});