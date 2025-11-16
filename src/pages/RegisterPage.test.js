import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import RegisterPage from './RegisterPage';

describe('RegisterPage', () => {
  const renderRegisterPage = () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <RegisterPage />
        </BrowserRouter>
      </AuthProvider>
    );
  };

  it('renders register page container', () => {
    renderRegisterPage();
    expect(screen.getByText(/create an account/i)).toBeInTheDocument();
  });

  it('renders the register form', () => {
    renderRegisterPage();
    expect(screen.getByPlaceholderText(/enter your full name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your password/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/confirm your password/i)).toBeInTheDocument();
  });
});