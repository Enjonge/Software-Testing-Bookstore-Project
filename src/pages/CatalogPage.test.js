import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { StoreProvider } from '../store/StoreProvider';
import CatalogPage from './CatalogPage';

const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <StoreProvider>
      {children}
    </StoreProvider>
  </BrowserRouter>
);

describe('CatalogPage', () => {
  test('renders catalog page structure', () => {
    render(
      <TestWrapper>
        <CatalogPage />
      </TestWrapper>
    );
    
    expect(screen.getByText('Our Collection')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search books...')).toBeInTheDocument();
  });

  test('shows search functionality', () => {
    render(
      <TestWrapper>
        <CatalogPage />
      </TestWrapper>
    );
    
    expect(screen.getByPlaceholderText('Search books...')).toBeInTheDocument();
  });

  test('displays book catalog content', () => {
    render(
      <TestWrapper>
        <CatalogPage />
      </TestWrapper>
    );

    // Look for book-related content
    const bookElements = screen.getAllByText(/book|collection|catalog|library/i);
    expect(bookElements.length).toBeGreaterThan(0);
  });

  test('shows multiple book cards', () => {
    render(
      <TestWrapper>
        <CatalogPage />
      </TestWrapper>
    );

    // Test that multiple books are displayed
    const bookTitles = screen.getAllByTestId('book-title');
    expect(bookTitles.length).toBeGreaterThan(1);
  });

  test('displays book prices in Ksh format', () => {
    render(
      <TestWrapper>
        <CatalogPage />
      </TestWrapper>
    );

    // Test that prices are shown in Kenya Shillings
    const priceElements = screen.getAllByTestId('book-price');
    expect(priceElements.length).toBeGreaterThan(0);
    expect(priceElements[0]).toHaveTextContent(/Ksh/i);
  });

  test('has add to cart buttons', () => {
    render(
      <TestWrapper>
        <CatalogPage />
      </TestWrapper>
    );

    // Test that add to cart buttons are present
    const cartButtons = screen.getAllByTestId('book-buy-button');
    expect(cartButtons.length).toBeGreaterThan(0);
    expect(cartButtons[0]).toHaveTextContent('Add to Cart');
  });

  test('renders catalog layout consistently', () => {
    render(
      <TestWrapper>
        <CatalogPage />
      </TestWrapper>
    );

    // Test that the catalog has proper structure
    const heading = screen.getByRole('heading', { name: /our collection/i });
    const searchInput = screen.getByPlaceholderText(/search books/i);
    
    expect(heading).toBeInTheDocument();
    expect(searchInput).toBeInTheDocument();
  });
});