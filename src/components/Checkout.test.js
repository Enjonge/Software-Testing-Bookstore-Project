import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { StoreProvider } from '../store/StoreProvider';
import Checkout from './Checkout';

const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <StoreProvider>
      {children}
    </StoreProvider>
  </BrowserRouter>
);

describe('Checkout', () => {
  test('renders checkout component', () => {
    render(
      <TestWrapper>
        <Checkout />
      </TestWrapper>
    );

    // Use getAllByText since there are multiple matching elements
    const checkoutElements = screen.getAllByText(/checkout/i);
    expect(checkoutElements.length).toBeGreaterThan(0);
  });

  test('displays empty cart message', () => {
    render(
      <TestWrapper>
        <Checkout />
      </TestWrapper>
    );

    // Test for the actual empty cart message
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
    expect(screen.getByText(/add some books to checkout/i)).toBeInTheDocument();
  });

  test('has structured checkout layout', () => {
    render(
      <TestWrapper>
        <Checkout />
      </TestWrapper>
    );

    // Test that the checkout content is properly structured
    const heading = screen.getByRole('heading', { name: /checkout/i });
    const paragraph = screen.getByText(/your cart is empty/i);
    
    expect(heading).toBeInTheDocument();
    expect(paragraph).toBeInTheDocument();
  });

  test('renders consistent checkout interface', () => {
    render(
      <TestWrapper>
        <Checkout />
      </TestWrapper>
    );

    // Use getAllByText and take the first one to avoid multiple elements error
    const checkoutElements = screen.getAllByText(/checkout/i);
    const container = checkoutElements[0].closest('div');
    expect(container).toBeInTheDocument();
  });
});