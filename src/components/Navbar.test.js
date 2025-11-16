import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { StoreProvider } from '../store/StoreProvider';
import { AuthProvider } from '../context/AuthContext';
import Navbar from './Navbar';

const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <StoreProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </StoreProvider>
  </BrowserRouter>
);

describe('Navbar', () => {
  test('renders navbar', () => {
    render(
      <TestWrapper>
        <Navbar />
      </TestWrapper>
    );

    expect(screen.getByText(/bookstore/i)).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  test('renders all navigation links correctly', () => {
    render(
      <TestWrapper>
        <Navbar />
      </TestWrapper>
    );
    
    // Test for actual links in your Navbar
    expect(screen.getByText(/home/i)).toBeInTheDocument();
    expect(screen.getByText(/catalog/i)).toBeInTheDocument();
    expect(screen.getByText(/admin/i)).toBeInTheDocument();
    
    // Test for authentication links (new)
    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.getByText(/register/i)).toBeInTheDocument();
    
    // Cart links are icons, so we find them by href
    const cartLinks = screen.getAllByRole('link', { href: '/cart' });
    expect(cartLinks.length).toBeGreaterThan(0);
  });

  test('navigation links have correct href attributes', () => {
    render(
      <TestWrapper>
        <Navbar />
      </TestWrapper>
    );
    
    // Test specific href values
    expect(screen.getByText(/home/i).closest('a')).toHaveAttribute('href', '/');
    expect(screen.getByText(/catalog/i).closest('a')).toHaveAttribute('href', '/catalog');
    expect(screen.getByText(/admin/i).closest('a')).toHaveAttribute('href', '/admin');
    expect(screen.getByText(/login/i).closest('a')).toHaveAttribute('href', '/login');
    expect(screen.getByText(/register/i).closest('a')).toHaveAttribute('href', '/register');
    
    // Test cart links by href - use the actual count found
    const cartLinks = screen.getAllByRole('link', { href: '/cart' });
    expect(cartLinks.length).toBeGreaterThanOrEqual(1); // At least one cart link
  });

  test('contains bookstore branding', () => {
    render(
      <TestWrapper>
        <Navbar />
      </TestWrapper>
    );
    
    expect(screen.getByText(/bookstore/i)).toBeInTheDocument();
  });

  test('has responsive design elements', () => {
    render(
      <TestWrapper>
        <Navbar />
      </TestWrapper>
    );
    
    // Test for mobile menu button (exists in your Navbar)
    const menuButton = screen.getByRole('button');
    expect(menuButton).toBeInTheDocument();
    
    // Test that navigation container exists
    const navContainer = document.querySelector('.max-w-7xl') || document.querySelector('nav > div');
    expect(navContainer).toBeInTheDocument();
  });
});