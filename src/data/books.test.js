// Make sure your books data file exports correctly
import { books } from './books'; // or whatever your import path is

describe('Books Data', () => {
  test('books array is defined and not empty', () => {
    expect(books).toBeDefined();
    expect(Array.isArray(books)).toBe(true);
    expect(books.length).toBeGreaterThan(0);
  });

  test('each book has required properties', () => {
    books.forEach(book => {
      expect(book).toHaveProperty('id');
      expect(book).toHaveProperty('title');
      expect(book).toHaveProperty('author');
      expect(book).toHaveProperty('price');
    });
  });

  test('book prices are positive numbers', () => {
    books.forEach(book => {
      expect(book.price).toBeGreaterThan(0);
    });
  });
});