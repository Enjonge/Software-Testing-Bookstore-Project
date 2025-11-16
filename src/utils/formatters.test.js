// src/utils/__tests__/formatters.test.js
import { formatDate, formatPrice, truncateText } from './formatters';

describe('Formatters', () => {
  test('formatDate formats timestamp correctly', () => {
    const timestamp = '2023-12-25T10:30:00Z';
    const formatted = formatDate(timestamp);
    expect(formatted).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
  });

  test('formatPrice formats number as currency', () => {
    const price = 29.99;
    const formatted = formatPrice(price);
    expect(formatted).toMatch(/^KSh \d+\.\d{2}$/);
  });

  test('truncateText shortens long text', () => {
    const longText = 'This is a very long text that should be truncated';
    const truncated = truncateText(longText, 20);
    expect(truncated.length).toBeLessThanOrEqual(23); // 20 + '...'
    expect(truncated).toContain('...');
  });
});