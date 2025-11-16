import { formatCurrency, APP_CURRENCY, SUPPORTED_CURRENCIES } from './currency';

describe('Currency Config', () => {
  test('formatCurrency function works correctly', () => {
    const formatted = formatCurrency(29.99);
    expect(typeof formatted).toBe('string');
    
    // Check that APP_CURRENCY.symbol exists and is in the formatted string
    expect(APP_CURRENCY.symbol).toBeDefined();
    expect(typeof APP_CURRENCY.symbol).toBe('string');
    expect(formatted).toContain(APP_CURRENCY.symbol);
  });

  test('APP_CURRENCY is in SUPPORTED_CURRENCIES', () => {
    const found = SUPPORTED_CURRENCIES.find(curr => curr.code === APP_CURRENCY.code);
    expect(found).toBeDefined();
    expect(found.code).toEqual(APP_CURRENCY.code);
  });
});