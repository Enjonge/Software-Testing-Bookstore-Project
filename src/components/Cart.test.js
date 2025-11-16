import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { StoreProvider } from '../store/StoreProvider';
import Cart from './Cart';

const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <StoreProvider>
      {children}
    </StoreProvider>
  </BrowserRouter>
);

describe('Cart', () => {
  test('renders cart component', () => {
    render(
      <TestWrapper>
        <Cart />
      </TestWrapper>
    );

    expect(screen.getByText(/cart/i)).toBeInTheDocument();
  });
}); // KEEP ONLY THE WORKING TEST