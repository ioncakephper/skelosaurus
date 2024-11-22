// __tests__/skelo-utils/generated.buildLink.test.

/*
 * buildLink
 *  - should return a link object with label and href
 *  - should use href as label if label is not provided
 */

const { buildLink } = require('../../lib/skelo-utils');

describe('buildLink', () => {
  test('should return a link object with label and href', () => {
    const sidebarItem = { label: 'Google', href: 'https://www.google.com' };
    const expected = { type: 'link', label: 'Google', href: 'https://www.google.com' };
    expect(buildLink(sidebarItem)).toEqual(expected);
  });

  test('should use href as label if label is not provided', () => {
    const sidebarItem = { href: 'https://www.google.com' };
    const expected = { type: 'link', label: 'https://www.google.com', href: 'https://www.google.com' };
    expect(buildLink(sidebarItem)).toEqual(expected);
  });
  
  test('should throw an error if href is not a non-empty string, a null, or undefined', () => {
    expect(() => buildLink({ href: '' })).toThrowError();
    expect(() => buildLink({ href: 123 })).toThrowError();
    expect(() => buildLink({ href: null })).toThrowError();
    expect(() => buildLink({ href: undefined })).toThrowError();
  });
  
  test('should return null if sidebarItem is null or undefined', () => {
    expect(buildLink(null)).toBeNull();
    expect(buildLink(undefined)).toBeNull();
  });

  test('should throw an error if sidebarItem is not an object', () => {
    expect(() => buildLink('string')).toThrowError();
    expect(() => buildLink(123)).toThrowError();
  });
});