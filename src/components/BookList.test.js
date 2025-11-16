import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { StoreProvider } from '../store/StoreProvider';
import BookList from './BookList';

const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <StoreProvider>
      {children}
    </StoreProvider>
  </BrowserRouter>
);

describe('BookList', () => {
  const mockBooks = [
    {
      id: 1,
      title: 'Test Book 1',
      author: 'Test Author 1',
      price: 1000,
      image: 'test1.jpg',
      description: 'Test description 1',
    },
    {
      id: 2,
      title: 'Test Book 2',
      author: 'Test Author 2',
      price: 1500,
      image: 'test2.jpg',
      description: 'Test description 2',
    }
  ];

  test('renders book list', () => {
    render(
      <TestWrapper>
        <BookList books={mockBooks} />
      </TestWrapper>
    );

    expect(screen.getByText('Test Book 1')).toBeInTheDocument();
    expect(screen.getByText('Test Book 2')).toBeInTheDocument();
  });

  test('displays all books in the list', () => {
    render(
      <TestWrapper>
        <BookList books={mockBooks} />
      </TestWrapper>
    );

    const bookElements = screen.getAllByText(/Test Book/i);
    expect(bookElements.length).toBeGreaterThanOrEqual(2);
  });

  test('shows book prices correctly', () => {
    render(
      <TestWrapper>
        <BookList books={mockBooks} />
      </TestWrapper>
    );

    const priceElements = screen.getAllByText(/KSh/i);
    expect(priceElements.length).toBeGreaterThan(0);
  });

  test('renders book list container', () => {
    render(
      <TestWrapper>
        <BookList books={mockBooks} />
      </TestWrapper>
    );

    const bookListContainer = document.querySelector('[class*="grid"], [class*="flex"]');
    expect(bookListContainer).toBeInTheDocument();
  });
});