const { normalizeItem } = require('../../lib/skelo-utils');

describe('normalizeItem', () => {
  test('throws error for invalid item types', () => {
    expect(() => normalizeItem(123)).toThrowError('Invalid item: 123');
    expect(() => normalizeItem(null)).toThrowError('Invalid item: null');
    expect(() => normalizeItem(undefined)).toThrowError('Invalid item: undefined');
  });

  test('normalizes string item', () => {
    const result = normalizeItem('hello');
    expect(result).toEqual({ label: 'hello' });
  });

  test('normalizes object item without label property', () => {
    const item = { foo: ['bar'] };
    const result = normalizeItem(item);
    expect(result).toEqual({ label: 'foo', items: [{label: 'bar'}] });
  });

  test('throws error for object without label property and whose values is not an array', () => {
    const item = { foo: 'bar' };
    expect(() => normalizeItem(item)).toThrow();
  })

  test('throws error for empty label', () => {
    const item = { label: '' };
    expect(() => normalizeItem(item)).toThrowError('Label cannot be an empty string');
  });

  test('throws error for non-array items property', () => {
    const item = { label: 'foo', items: 'foo' };
    expect(() => normalizeItem(item)).toThrowError('Item property must be an array');
  });

  test('throws error for non-array headings property', () => {
    const item = { label: 'foo', headings: 'foo' };
    expect(() => normalizeItem(item)).toThrowError('Headings property must be an array');
  });

  test('throws error for both items and headings properties', () => {
    const item = { label: 'foo', items: [], headings: [] };
    expect(() => normalizeItem(item)).toThrowError('Cannot have both items and headings properties');
  });

  test('recursively normalizes items', () => {
    const item = {
      label: 'foo',
      items: [
        { label: 'bar' },
        { label: 'baz' },
      ],
    };
    const result = normalizeItem(item);
    expect(result).toEqual({
      label: 'foo',
      items: [
        { label: 'bar' },
        { label: 'baz' },
      ],
    });
  });

  test('recursively normalizes headings', () => {
    const item = {
      label: 'foo',
      headings: [
        { label: 'qux' },
        { label: 'quux' },
      ],
    };
    const result = normalizeItem(item);
    expect(result).toEqual({
      label: 'foo',
      headings: [
        { label: 'qux' },
        { label: 'quux' },
      ],
    });
  });

  
});