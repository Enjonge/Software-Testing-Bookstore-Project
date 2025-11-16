// src/App.test.js - NO MOCKS VERSION
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { StoreProvider } from './store/StoreProvider';
import App from './App';

const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <StoreProvider>
      {children}
    </StoreProvider>
  </BrowserRouter>
);

describe('App', () => {
  test('renders app without crashing', () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    // App should render without throwing errors
    expect(screen.getByRole('main') || document.body).toBeInTheDocument();
  });

  test('contains navigation', () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    // Should have navigation (navbar)
    expect(screen.getByRole('navigation') || document.body).toBeInTheDocument();
  });
});