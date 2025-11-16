import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { StoreProvider } from '../store/StoreProvider';
import BookDetailsPage from './BookDetailsPage';

const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <StoreProvider>
      {children}
    </StoreProvider>
  </BrowserRouter>
);

describe('BookDetailsPage', () => {
  test('renders book details page structure', () => {
    render(
      <TestWrapper>
        <BookDetailsPage />
      </TestWrapper>
    );
    
    // Should show book not found or basic structure
    const pageContent = screen.getByText('Book Details') || document.body;
    expect(pageContent).toBeInTheDocument();
  });

  test('displays book information section', () => {
    render(
      <TestWrapper>
        <BookDetailsPage />
      </TestWrapper>
    );

    // Look for book-related content
    const bookElements = screen.getAllByText(/book|details|information|description/i);
    expect(bookElements.length).toBeGreaterThan(0);
  });

  test('shows placeholder book content', () => {
    render(
      <TestWrapper>
        <BookDetailsPage />
      </TestWrapper>
    );

    // Test the actual placeholder message
    expect(screen.getByText('Detailed information about the selected book.')).toBeInTheDocument();
    expect(screen.getByText('Book details will be displayed here.')).toBeInTheDocument();
  });

  test('has structured book details layout', () => {
    render(
      <TestWrapper>
        <BookDetailsPage />
      </TestWrapper>
    );

    // Test that the book details page has proper structure
    const heading = screen.getByRole('heading', { name: /book details/i });
    const description = screen.getByText(/detailed information about the selected book/i);
    const placeholder = screen.getByText(/book details will be displayed here/i);
    
    expect(heading).toBeInTheDocument();
    expect(description).toBeInTheDocument();
    expect(placeholder).toBeInTheDocument();
  });

  test('renders book details container', () => {
    render(
      <TestWrapper>
        <BookDetailsPage />
      </TestWrapper>
    );

    // Use getAllByText and take the first one to avoid multiple elements error
    const bookDetailsElements = screen.getAllByText(/book details/i);
    const container = bookDetailsElements[0].closest('div');
    expect(container).toBeInTheDocument();
  });

  test('displays informative book page content', () => {
    render(
      <TestWrapper>
        <BookDetailsPage />
      </TestWrapper>
    );

    // Use getAllByText since there are multiple matching elements
    const bookContentElements = screen.getAllByText(/book/i);
    expect(bookContentElements.length).toBeGreaterThan(0);
  });
});