import { 
  PAYSTACK_PUBLIC_KEY, 
  toMinorUnits, 
  verifyPayment 
} from './paystack';

// Mock console to avoid actual logging during tests
console.log = jest.fn();

describe('paystack utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('toMinorUnits', () => {
    test('converts amount to minor units correctly', () => {
      expect(toMinorUnits(29.99)).toBe(2999);
      expect(toMinorUnits(100)).toBe(10000);
      expect(toMinorUnits(0.99)).toBe(99);
    });

    test('handles floating point precision', () => {
      // Test that floating point math doesn't cause issues
      expect(toMinorUnits(29.99)).toBe(2999); // Not 2998
    });

    test('handles string numbers', () => {
      expect(toMinorUnits('29.99')).toBe(2999);
    });

    test('handles zero and negative numbers', () => {
      expect(toMinorUnits(0)).toBe(0);
      expect(toMinorUnits(-10)).toBe(-1000);
    });
  });

  describe('verifyPayment', () => {
    test('logs verification attempt and returns success', async () => {
      const result = await verifyPayment('test-reference-123');
      
      expect(console.log).toHaveBeenCalledWith('Verifying payment:', 'test-reference-123');
      expect(result).toEqual({ 
        status: 'success', 
        reference: 'test-reference-123' 
      });
    });

    test('returns success for different reference formats', async () => {
      const result1 = await verifyPayment('REF-12345');
      const result2 = await verifyPayment('order_67890');
      
      expect(result1.status).toBe('success');
      expect(result2.status).toBe('success');
      expect(result1.reference).toBe('REF-12345');
      expect(result2.reference).toBe('order_67890');
    });
  });// In src/utils/paystack.test.js
jest.mock('../config/currency', () => ({
  APP_CURRENCY: 'KES', // Change this to match your actual app configuration
  SUPPORTED_CURRENCIES: ['KES', 'NGN', 'USD', 'GHS', 'ZAR']
}));


  describe('PAYSTACK_PUBLIC_KEY', () => {
    test('has a valid public key format', () => {
      expect(PAYSTACK_PUBLIC_KEY).toMatch(/^pk_(test|live)_/);
    });

    test('is defined', () => {
      expect(PAYSTACK_PUBLIC_KEY).toBeDefined();
      expect(PAYSTACK_PUBLIC_KEY).not.toBe('');
    });
  });
});