import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { StoreProvider } from '../store/StoreProvider';
import HomePage from './HomePage';

const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <StoreProvider>
      {children}
    </StoreProvider>
  </BrowserRouter>
);

describe('HomePage', () => {
  test('renders home page content', () => {
    render(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    );

    // Check for any home page content
    const homeElements = screen.getAllByText(/welcome|home|bookstore/i);
    expect(homeElements.length).toBeGreaterThan(0);
  });

  test('displays welcome message', () => {
    render(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    );

    // Test the actual welcome message
    expect(screen.getByText('Welcome to Our Bookstore')).toBeInTheDocument();
    expect(screen.getByText('Discover amazing books in our collection')).toBeInTheDocument();
  });

  test('contains catalog navigation link', () => {
    render(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    );

    // Test the browse books link
    const catalogLink = screen.getByRole('link', { name: /browse books/i });
    expect(catalogLink).toHaveAttribute('href', '/catalog');
  });

  test('shows call-to-action elements', () => {
    render(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    );

    // Look for CTAs like "Browse Books"
    const ctaElements = screen.getAllByText(/browse books|discover|explore/i);
    expect(ctaElements.length).toBeGreaterThan(0);
  });

  test('has home page layout structure', () => {
    render(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    );

    // Test that the page has proper structure
    const heading = screen.getByRole('heading');
    const paragraph = screen.getByText(/discover amazing books/i);
    const link = screen.getByRole('link');
    
    expect(heading).toBeInTheDocument();
    expect(paragraph).toBeInTheDocument();
    expect(link).toBeInTheDocument();
  });
});