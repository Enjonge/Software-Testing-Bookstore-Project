import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { StoreProvider } from '../store/StoreProvider';
import BookCard from './BookCard';

const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <StoreProvider>
      {children}
    </StoreProvider>
  </BrowserRouter>
);

describe('BookCard', () => {
  const mockBook = {
    id: 1,
    title: 'Test Book',
    author: 'Test Author',
    price: 1000,
    image: 'test.jpg',
    description: 'Test description',
  };

  test('renders book information', () => {
    render(
      <TestWrapper>
        <BookCard book={mockBook} />
      </TestWrapper>
    );

    expect(screen.getByText('Test Book')).toBeInTheDocument();
    expect(screen.getByText('by Test Author')).toBeInTheDocument();
    expect(screen.getByText('Add to Cart')).toBeInTheDocument();
  });

  test('displays book details correctly', () => {
    render(
      <TestWrapper>
        <BookCard book={mockBook} />
      </TestWrapper>
    );

    expect(screen.getByText(mockBook.description)).toBeInTheDocument();
    expect(screen.getByText(/KSh/i)).toBeInTheDocument();
  });

  test('contains book image', () => {
    render(
      <TestWrapper>
        <BookCard book={mockBook} />
      </TestWrapper>
    );

    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockBook.image);
  });

  test('has interactive elements', () => {
    render(
      <TestWrapper>
        <BookCard book={mockBook} />
      </TestWrapper>
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });
});