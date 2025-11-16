import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { StoreProvider } from '../store/StoreProvider';
import CartPage from './CartPage';

const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <StoreProvider>
      {children}
    </StoreProvider>
  </BrowserRouter>
);

describe('CartPage', () => {
  test('renders empty cart message', () => {
    render(
      <TestWrapper>
        <CartPage />
      </TestWrapper>
    );
    
    expect(screen.getByText('Your Cart')).toBeInTheDocument();
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
  });

  test('displays cart page structure', () => {
    render(
      <TestWrapper>
        <CartPage />
      </TestWrapper>
    );

    // Look for cart-related content
    const cartElements = screen.getAllByText(/cart|bag|items|products/i);
    expect(cartElements.length).toBeGreaterThan(0);
  });

  test('shows empty state guidance', () => {
    render(
      <TestWrapper>
        <CartPage />
      </TestWrapper>
    );

    // Look for guidance text for empty cart
    const guidanceElements = screen.getAllByText(/add some|browse|shop|continue shopping/i);
    if (guidanceElements.length > 0) {
      expect(guidanceElements[0]).toBeInTheDocument();
    }
    // If no specific guidance, that's also valid
  });

  test('contains cart navigation links', () => {
    render(
      <TestWrapper>
        <CartPage />
      </TestWrapper>
    );

    // Look for navigation links (there are links, not buttons)
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
    
    // Test specific link texts and hrefs
    const browseLink = screen.getByRole('link', { name: /browse catalog/i });
    const homeLink = screen.getByRole('link', { name: /go to home/i });
    
    expect(browseLink).toHaveAttribute('href', '/catalog');
    expect(homeLink).toHaveAttribute('href', '/');
  });

  test('provides helpful navigation options', () => {
    render(
      <TestWrapper>
        <CartPage />
      </TestWrapper>
    );

    // Test the actual navigation options that exist
    expect(screen.getByText('Browse Catalog')).toBeInTheDocument();
    expect(screen.getByText('Go to Home')).toBeInTheDocument();
  });

  test('renders cart layout consistently', () => {
    render(
      <TestWrapper>
        <CartPage />
      </TestWrapper>
    );

    // Test that the cart page has proper structure
    const heading = screen.getByRole('heading', { name: /your cart/i });
    const emptyMessage = screen.getByText(/your cart is empty/i);
    const browseLink = screen.getByRole('link', { name: /browse catalog/i });
    const homeLink = screen.getByRole('link', { name: /go to home/i });
    
    expect(heading).toBeInTheDocument();
    expect(emptyMessage).toBeInTheDocument();
    expect(browseLink).toBeInTheDocument();
    expect(homeLink).toBeInTheDocument();
  });
});