// src/store/storeActions.test.js - DEBUG VERSION
import StoreProvider, * as StoreExports from './StoreProvider';

// Debug: log what we're importing
console.log('StoreProvider:', StoreProvider);
console.log('StoreExports:', StoreExports);
console.log('storeReducer from exports:', StoreExports.storeReducer);
console.log('Type of storeReducer:', typeof StoreExports.storeReducer);

// Try different ways to access the reducer
const storeReducer = StoreExports.storeReducer;

// If it's still not working, let's create a simple test first
describe('Store Reducer Debug', () => {
  test('check if storeReducer exists', () => {
    console.log('Available exports:', Object.keys(StoreExports));
    expect(StoreExports.storeReducer).toBeDefined();
    expect(typeof StoreExports.storeReducer).toBe('function');
  });
});