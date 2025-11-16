import { safeGetItem, safeSetItem, safeRemoveItem } from './storage';

describe('Storage Utilities', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('safeGetItem', () => {
    test('returns fallback for missing key', () => {
      const result = safeGetItem('nonexistent', 'default');
      expect(result).toBe('default');
    });

    test('returns parsed value for existing key', () => {
      const testData = { name: 'John', age: 30 };
      safeSetItem('testKey', testData);
      const result = safeGetItem('testKey');
      expect(result).toEqual(testData);
    });

    test('returns fallback on JSON parse error', () => {
      // Directly set invalid JSON to simulate parse error
      localStorage.setItem('invalidJson', 'invalid{json');
      const result = safeGetItem('invalidJson', 'fallback');
      expect(result).toBe('fallback');
    });

    test('returns null when no fallback provided for missing key', () => {
      const result = safeGetItem('nonexistent');
      expect(result).toBeNull();
    });
  });

  describe('safeSetItem', () => {
    test('successfully sets item and returns true', () => {
      const testData = { value: 'test' };
      const result = safeSetItem('testKey', testData);
      expect(result).toBe(true);
      
      // Verify it was actually stored
      const stored = localStorage.getItem('testKey');
      expect(stored).toBe(JSON.stringify(testData));
    });

    test('handles primitive values correctly', () => {
      expect(safeSetItem('string', 'hello')).toBe(true);
      expect(safeSetItem('number', 42)).toBe(true);
      expect(safeSetItem('boolean', true)).toBe(true);
      expect(safeSetItem('null', null)).toBe(true);
    });
  });

  describe('safeRemoveItem', () => {
    test('successfully removes existing item', () => {
      safeSetItem('testKey', 'value');
      const result = safeRemoveItem('testKey');
      expect(result).toBe(true);
      expect(localStorage.getItem('testKey')).toBeNull();
    });

    test('returns true for non-existent key', () => {
      const result = safeRemoveItem('nonexistent');
      expect(result).toBe(true);
    });
  });

  describe('integration between functions', () => {
    test('full cycle: set, get, remove', () => {
      const testData = { book: 'Test Book', price: 1000 };
      
      // Set data
      const setResult = safeSetItem('bookData', testData);
      expect(setResult).toBe(true);
      
      // Get data
      const getResult = safeGetItem('bookData');
      expect(getResult).toEqual(testData);
      
      // Remove data
      const removeResult = safeRemoveItem('bookData');
      expect(removeResult).toBe(true);
      
      // Verify removal
      const afterRemove = safeGetItem('bookData', 'not-found');
      expect(afterRemove).toBe('not-found');
    });
  });
});