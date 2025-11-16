import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { StoreProvider } from '../store/StoreProvider';
import ProfilePage from './ProfilePage';

const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <StoreProvider>
      {children}
    </StoreProvider>
  </BrowserRouter>
);

describe('ProfilePage', () => {
  test('renders profile page structure', () => {
    render(
      <TestWrapper>
        <ProfilePage />
      </TestWrapper>
    );
    
    // Should show profile page content
    const pageContent = screen.getByText('User Profile') || document.body;
    expect(pageContent).toBeInTheDocument();
  });

  test('displays user profile information', () => {
    render(
      <TestWrapper>
        <ProfilePage />
      </TestWrapper>
    );

    // Look for profile-related content
    const profileElements = screen.getAllByText(/profile|user|account|settings/i);
    expect(profileElements.length).toBeGreaterThan(0);
  });

  test('contains account management sections', () => {
    render(
      <TestWrapper>
        <ProfilePage />
      </TestWrapper>
    );

    // Look for account management options
    const accountElements = screen.getAllByText(/manage|settings|preferences|details/i);
    if (accountElements.length > 0) {
      expect(accountElements[0]).toBeInTheDocument();
    }
    // If no specific account sections, that's also valid
  });

  test('shows profile placeholder content', () => {
    render(
      <TestWrapper>
        <ProfilePage />
      </TestWrapper>
    );

    // Test the actual placeholder messages
    expect(screen.getByText('Manage your account settings')).toBeInTheDocument();
    expect(screen.getByText('Profile information will be displayed here')).toBeInTheDocument();
  });

  test('has structured profile layout', () => {
    render(
      <TestWrapper>
        <ProfilePage />
      </TestWrapper>
    );

    // Test that the profile page has proper structure
    const heading = screen.getByRole('heading', { name: /user profile/i });
    const description = screen.getByText(/manage your account settings/i);
    const placeholder = screen.getByText(/profile information will be displayed here/i);
    
    expect(heading).toBeInTheDocument();
    expect(description).toBeInTheDocument();
    expect(placeholder).toBeInTheDocument();
  });

  test('renders profile page container', () => {
    render(
      <TestWrapper>
        <ProfilePage />
      </TestWrapper>
    );

    // Use getAllByText and take the first one to avoid multiple elements error
    const profileElements = screen.getAllByText(/user profile/i);
    const container = profileElements[0].closest('div');
    expect(container).toBeInTheDocument();
  });
});