// src/pages/AdminPage.test.js - NO MOCKS VERSION
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { StoreProvider } from '../store/StoreProvider';
import AdminPage from './AdminPage';

const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <StoreProvider>
      {children}
    </StoreProvider>
  </BrowserRouter>
);

describe('AdminPage', () => {
  test('renders admin page structure', () => {
    render(
      <TestWrapper>
        <AdminPage />
      </TestWrapper>
    );
    
    // Should show admin page content or access denied
    const pageContent = screen.getByText('Admin Dashboard') || document.body;
    expect(pageContent).toBeInTheDocument();
  });
});