// src/context/AuthContext.test.js
import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';

// Test component that uses the auth context
const TestComponent = () => {
  const { user, isAuthenticated, login, logout, register } = useAuth();
  
  const handleValidLogin = async () => {
    await login('test@example.com', 'password123');
  };

  const handleInvalidLogin = async () => {
    await login('invalid@example.com', 'wrongpassword');
  };

  const handleRegister = async () => {
    await register('newuser@example.com', 'password123', 'New User');
  };

  return (
    <div>
      <div data-testid="user">{user ? user.email : 'No user'}</div>
      <div data-testid="isAuthenticated">{isAuthenticated.toString()}</div>
      <div data-testid="error-message"></div>
      <button onClick={handleValidLogin}>Valid Login</button>
      <button onClick={handleInvalidLogin}>Invalid Login</button>
      <button onClick={handleRegister}>Register</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    // Clear localStorage and mock users before each test
    localStorage.clear();
    localStorage.setItem('bookstore_users', JSON.stringify([
      { email: 'test@example.com', password: 'password123', name: 'Test User' },
      { email: 'admin@bookstore.com', password: 'admin123', name: 'Admin User' }
    ]));
  });

  it('provides initial null user state', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('user')).toHaveTextContent('No user');
    expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false');
  });

  it('handles login functionality with valid credentials', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = screen.getByText('Valid Login');
    
    await act(async () => {
      loginButton.click();
    });

    expect(screen.getByTestId('user')).toHaveTextContent('test@example.com');
    expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('true');
  });

  it('handles login functionality with invalid credentials', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = screen.getByText('Invalid Login');
    
    await act(async () => {
      loginButton.click();
    });

    // Should not log in with invalid credentials
    expect(screen.getByTestId('user')).toHaveTextContent('No user');
    expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false');
  });

  it('handles registration functionality', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const registerButton = screen.getByText('Register');
    
    await act(async () => {
      registerButton.click();
    });

    expect(screen.getByTestId('user')).toHaveTextContent('newuser@example.com');
    expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('true');
  });

  it('handles logout functionality', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // First login
    const loginButton = screen.getByText('Valid Login');
    await act(async () => {
      loginButton.click();
    });

    // Then logout
    const logoutButton = screen.getByText('Logout');
    await act(async () => {
      logoutButton.click();
    });

    expect(screen.getByTestId('user')).toHaveTextContent('No user');
    expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false');
  });

  it('loads user from localStorage on mount', () => {
    // Set up localStorage before rendering
    const mockUser = {
      id: 1,
      email: 'stored@example.com',
      name: 'Stored User',
      token: 'stored_token'
    };
    localStorage.setItem('bookstore_user', JSON.stringify(mockUser));
    localStorage.setItem('bookstore_token', 'stored_token');

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Should load user from localStorage
    expect(screen.getByTestId('user')).toHaveTextContent('stored@example.com');
    expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('true');
  });
});