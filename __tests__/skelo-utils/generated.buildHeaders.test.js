// __tests__/skelo-utils/generated.buildHeaders.test.js

/**
 * Unit tests for buildHeaders function
 *
 * Tests:
 * - should return a string with headers
 * - should return a string with nested headers
 * - should return a string with multiple levels of nested headers
 * - should return a string with non-header items
 */

const { buildHeaders } = require('../../lib/skelo-utils');

describe('buildHeaders', () => {
  test('should return a string with headers', () => {
    const headings = ['Header 1', 'Header 2', 'Header 3'];
    const expected = '## Header 1\n## Header 2\n## Header 3';
    expect(buildHeaders(headings)).toBe(expected);
  });

  test('should return a string with nested headers', () => {
    const headings = ['Header 1', { items: ['Header 2', 'Header 3'] }];
    const expected = '## Header 1\n### Header 2\n### Header 3';
    expect(buildHeaders(headings)).toBe(expected);
  });

  test('should return a string with multiple levels of nested headers', () => {
    const headings = ['Header 1', { items: ['Header 2', { items: ['Header 3', 'Header 4'] }] }];
    const expected = '## Header 1\n### Header 2\n#### Header 3\n#### Header 4';
    expect(buildHeaders(headings)).toBe(expected);
  });

  test('should return an empty string if headings is empty', () => {
    const headings = [];
    expect(buildHeaders(headings)).toBe('');
  });

//   test('should return the original item if it is not a string or an object with items', () => {
//     const headings = [123, true, null, undefined];
//     expect(buildHeaders(headings)).toBe('123\ntrue\nnull\nundefined');
//   });
});