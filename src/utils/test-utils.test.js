import React from 'react';
import { render } from './test-utils';

// Simple test component
const TestComponent = () => (
  <div data-testid="test-component">
    <h1>Test Component</h1>
    <button>Test Button</button>
  </div>
);

describe('Test Utilities - Render Function', () => {
  test('render function provides all testing-library utilities', () => {
    const utils = render(<TestComponent />);
    
    // Should have all standard testing-library properties
    expect(utils.getByTestId).toBeDefined();
    expect(utils.getByText).toBeDefined();
    expect(utils.container).toBeDefined();
    expect(utils.queryByTestId).toBeDefined();
  });

  test('render function works with BrowserRouter wrapper', () => {
    const { getByText } = render(<TestComponent />);
    
    // Component should render without router errors
    expect(getByText('Test Component')).toBeInTheDocument();
    expect(getByText('Test Button')).toBeInTheDocument();
  });

  test('render function accepts options parameter', () => {
    const { container } = render(<TestComponent />, {
      container: document.createElement('div')
    });
    
    expect(container).toBeDefined();
    expect(container.tagName).toBe('DIV');
  });

  test('can render multiple components independently', () => {
    const ComponentA = () => <div>Component A</div>;
    const ComponentB = () => <div>Component B</div>;
    
    const { getByText: getByTextA } = render(<ComponentA />);
    const { getByText: getByTextB } = render(<ComponentB />);
    
    expect(getByTextA('Component A')).toBeInTheDocument();
    expect(getByTextB('Component B')).toBeInTheDocument();
  });
});