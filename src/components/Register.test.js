import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import Register from './Register';

describe('Register Component', () => {
  const renderRegister = () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      </AuthProvider>
    );
  };

  it('renders register form with name field', () => {
    renderRegister();
    expect(screen.getByPlaceholderText(/enter your full name/i)).toBeInTheDocument();
  });

  it('renders register form with email field', () => {
    renderRegister();
    expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
  });

  it('renders register form with password field', () => {
    renderRegister();
    expect(screen.getByPlaceholderText(/enter your password/i)).toBeInTheDocument();
  });

  it('renders register form with confirm password field', () => {
    renderRegister();
    expect(screen.getByPlaceholderText(/confirm your password/i)).toBeInTheDocument();
  });

  it('renders register button', () => {
    renderRegister();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  it('allows typing in form fields', () => {
    renderRegister();
    
    const nameInput = screen.getByPlaceholderText(/enter your full name/i);
    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    const confirmInput = screen.getByPlaceholderText(/confirm your password/i);
    
    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmInput, { target: { value: 'password123' } });
    
    expect(nameInput.value).toBe('Test User');
    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
    expect(confirmInput.value).toBe('password123');
  });

  it('shows login link', () => {
    renderRegister();
    expect(screen.getByText(/login here/i)).toBeInTheDocument();
  });
});