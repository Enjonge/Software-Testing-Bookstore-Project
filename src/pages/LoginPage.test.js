import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import LoginPage from './LoginPage';

describe('LoginPage', () => {
  const renderLoginPage = () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </AuthProvider>
    );
  };

  it('renders login page container', () => {
    renderLoginPage();
    expect(screen.getByText(/login to your account/i)).toBeInTheDocument();
  });

  it('renders the login form', () => {
    renderLoginPage();
    expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your password/i)).toBeInTheDocument();
  });
});