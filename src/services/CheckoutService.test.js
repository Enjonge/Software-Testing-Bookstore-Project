import { startPayment } from './CheckoutService';

// Mock the paystack utils
jest.mock('../utils/paystack', () => ({
  initializePaystackPayment: jest.fn(),
  verifyPayment: jest.fn()
}));

// Mock the currency config
jest.mock('../config/currency', () => ({
  APP_CURRENCY: 'ZAR',
  SUPPORTED_CURRENCIES: ['KES', 'NGN', 'USD', 'GHS', 'ZAR']
}));

import { initializePaystackPayment, verifyPayment } from '../utils/paystack';

describe('CheckoutService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('startPayment', () => {
    const mockItems = [{ book: { title: 'Test Book', price: 29.99 } }];
    const mockEmail = 'test@example.com';
    const mockOnSuccess = jest.fn();
    const mockOnCancel = jest.fn();

    test('throws error when no items provided', async () => {
      await expect(startPayment({ items: [] })).rejects.toThrow('No items to pay for');
    });

    test('processes payment with first item', async () => {
      // Mock initializePaystackPayment to call the success callback immediately
      initializePaystackPayment.mockImplementation((book, email, onSuccess) => {
        // Call the success callback immediately with the response
        onSuccess({ reference: 'test-ref-123' }, book);
      });

      // Mock verifyPayment to resolve successfully
      verifyPayment.mockResolvedValue({ status: 'success', reference: 'test-ref-123' });

      // Call startPayment
      await startPayment({
        items: mockItems,
        email: mockEmail,
        onSuccess: mockOnSuccess,
        onCancel: mockOnCancel
      });

      // Add a small delay to ensure all async operations complete
      await new Promise(resolve => setTimeout(resolve, 0));

      // Now check the expectations
      expect(initializePaystackPayment).toHaveBeenCalledWith(
        mockItems[0].book,
        mockEmail,
        expect.any(Function),
        mockOnCancel,
        { currency: 'ZAR' }
      );

      expect(verifyPayment).toHaveBeenCalledWith('test-ref-123');
      expect(mockOnSuccess).toHaveBeenCalledWith({
        response: { reference: 'test-ref-123' },
        verification: { status: 'success', reference: 'test-ref-123' },
        purchasedBook: mockItems[0].book
      });
    });

    test('handles items without book property', async () => {
      const itemsWithoutBook = [{ title: 'Direct Book', price: 19.99 }];
      
      initializePaystackPayment.mockImplementation((book, email, onSuccess) => {
        onSuccess({ reference: 'test-ref' }, book);
      });
      verifyPayment.mockResolvedValue({ status: 'success' });

      await startPayment({
        items: itemsWithoutBook,
        email: 'test@example.com',
        onSuccess: mockOnSuccess
      });

      await new Promise(resolve => setTimeout(resolve, 0));

      expect(initializePaystackPayment).toHaveBeenCalledWith(
        itemsWithoutBook[0],
        'test@example.com',
        expect.any(Function),
        undefined,
        { currency: 'ZAR' }
      );
    });

    test('uses custom currency when provided', async () => {
      initializePaystackPayment.mockImplementation((book, email, onSuccess) => {
        onSuccess({ reference: 'test-ref' }, book);
      });
      verifyPayment.mockResolvedValue({ status: 'success' });

      await startPayment({
        items: mockItems,
        email: mockEmail,
        currency: 'USD',
        onSuccess: mockOnSuccess
      });

      await new Promise(resolve => setTimeout(resolve, 0));

      expect(initializePaystackPayment).toHaveBeenCalledWith(
        mockItems[0].book,
        mockEmail,
        expect.any(Function),
        undefined,
        { currency: 'USD' }
      );
    });

    test('uses default currency when no currency provided', async () => {
      initializePaystackPayment.mockImplementation((book, email, onSuccess) => {
        onSuccess({ reference: 'test-ref' }, book);
      });
      verifyPayment.mockResolvedValue({ status: 'success' });

      await startPayment({
        items: mockItems,
        email: mockEmail,
        onSuccess: mockOnSuccess
      });

      await new Promise(resolve => setTimeout(resolve, 0));

      expect(initializePaystackPayment).toHaveBeenCalledWith(
        mockItems[0].book,
        mockEmail,
        expect.any(Function),
        undefined,
        { currency: 'ZAR' }
      );
    });

    test('handles payment cancellation', async () => {
      initializePaystackPayment.mockImplementation((book, email, onSuccess, onCancel) => {
        onCancel(); // Simulate cancellation
      });

      await startPayment({
        items: mockItems,
        email: mockEmail,
        onSuccess: mockOnSuccess,
        onCancel: mockOnCancel
      });

      expect(mockOnCancel).toHaveBeenCalled();
      expect(mockOnSuccess).not.toHaveBeenCalled();
      expect(verifyPayment).not.toHaveBeenCalled();
    });
  });
});