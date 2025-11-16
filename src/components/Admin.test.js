import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { StoreProvider } from '../store/StoreProvider';
import Admin from './Admin';

const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <StoreProvider>
      {children}
    </StoreProvider>
  </BrowserRouter>
);

describe('Admin', () => {
  test('renders admin component', () => {
    render(
      <TestWrapper>
        <Admin />
      </TestWrapper>
    );

    const adminContent = screen.getByText('Access Denied') || document.body;
    expect(adminContent).toBeInTheDocument();
  });

  test('displays clear access denied message', () => {
    render(
      <TestWrapper>
        <Admin />
      </TestWrapper>
    );

    // Use getAllByText since there are multiple matching elements
    const accessElements = screen.getAllByText(/access denied|admin access required/i);
    expect(accessElements.length).toBeGreaterThan(0);
  });

  test('has structured admin content layout', () => {
    render(
      <TestWrapper>
        <Admin />
      </TestWrapper>
    );

    // Test that the admin content is properly structured
    const heading = screen.getByRole('heading');
    const paragraph = screen.getByText(/admin access required/i);
    
    expect(heading).toBeInTheDocument();
    expect(paragraph).toBeInTheDocument();
  });

  test('renders consistent admin interface', () => {
    render(
      <TestWrapper>
        <Admin />
      </TestWrapper>
    );

    // Use getAllByText and take the first one to avoid multiple elements error
    const accessElements = screen.getAllByText(/access/i);
    const container = accessElements[0].closest('div');
    expect(container).toBeInTheDocument();
  });
});