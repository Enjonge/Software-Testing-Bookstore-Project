// src/pages/CheckoutPage.test.js - NO MOCKS VERSION
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { StoreProvider } from '../store/StoreProvider';
import CheckoutPage from './CheckoutPage';

const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <StoreProvider>
      {children}
    </StoreProvider>
  </BrowserRouter>
);

describe('CheckoutPage', () => {
  test('renders empty cart message when cart is empty', () => {
    render(
      <TestWrapper>
        <CheckoutPage />
      </TestWrapper>
    );
    
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
    expect(screen.getByText(/continue shopping/i)).toBeInTheDocument();
  });

  test('renders checkout page structure', () => {
    render(
      <TestWrapper>
        <CheckoutPage />
      </TestWrapper>
    );
    
    expect(screen.getByText('Checkout')).toBeInTheDocument();
  });
});