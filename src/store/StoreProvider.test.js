import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { StoreProvider, useStore } from './StoreProvider';

// Mock component to test the store
const TestComponent = () => {
  const { cartCount, addToCart } = useStore();
  
  return (
    <div>
      <span data-testid="cart-count">{cartCount}</span>
      <button onClick={() => addToCart({ id: 1, title: 'Test Book', price: 10 })}>
        Add to Cart
      </button>
    </div>
  );
};

describe('StoreProvider', () => {
  test('provides cart management functions', () => {
    render(
      <StoreProvider>
        <TestComponent />
      </StoreProvider>
    );

    expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
    expect(screen.getByText('Add to Cart')).toBeInTheDocument();
  });

  test('addToCart adds items to cart', () => {
    render(
      <StoreProvider>
        <TestComponent />
      </StoreProvider>
    );

    const addButton = screen.getByText('Add to Cart');
    
    act(() => {
      addButton.click();
    });

    // Add your assertions here based on your implementation
  });
});