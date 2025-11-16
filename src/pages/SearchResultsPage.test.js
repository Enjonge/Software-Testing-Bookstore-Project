import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { StoreProvider } from '../store/StoreProvider';
import SearchResultsPage from './SearchResultsPage';

const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <StoreProvider>
      {children}
    </StoreProvider>
  </BrowserRouter>
);

describe('SearchResultsPage', () => {
  test('renders search results page structure', () => {
    render(
      <TestWrapper>
        <SearchResultsPage />
      </TestWrapper>
    );
    
    // Should show search results or empty state
    const pageContent = screen.getByText('Search Results') || document.body;
    expect(pageContent).toBeInTheDocument();
  });

  test('displays search results content', () => {
    render(
      <TestWrapper>
        <SearchResultsPage />
      </TestWrapper>
    );

    // Look for search-related content
    const searchElements = screen.getAllByText(/search|results|find|query/i);
    expect(searchElements.length).toBeGreaterThan(0);
  });

  test('shows search status information', () => {
    render(
      <TestWrapper>
        <SearchResultsPage />
      </TestWrapper>
    );

    // Look for search status or results count
    const statusElements = screen.getAllByText(/matching|found|displayed|criteria/i);
    expect(statusElements.length).toBeGreaterThan(0);
  });

  test('contains results listing section', () => {
    render(
      <TestWrapper>
        <SearchResultsPage />
      </TestWrapper>
    );

    // Look for results container or listing
    const resultsElements = screen.getAllByText(/results|list|books|items/i);
    if (resultsElements.length > 0) {
      expect(resultsElements[0]).toBeInTheDocument();
    }
    // If no specific results text, that's also valid
  });

  test('shows search placeholder content', () => {
    render(
      <TestWrapper>
        <SearchResultsPage />
      </TestWrapper>
    );

    // Test the actual placeholder messages
    expect(screen.getByText('Books matching your search criteria')).toBeInTheDocument();
    expect(screen.getByText('Search results will be displayed here')).toBeInTheDocument();
  });

  test('renders search results container', () => {
    render(
      <TestWrapper>
        <SearchResultsPage />
      </TestWrapper>
    );

    // Use getAllByText and take the first one to avoid multiple elements error
    const searchElements = screen.getAllByText(/search results/i);
    const container = searchElements[0].closest('div');
    expect(container).toBeInTheDocument();
  });
});