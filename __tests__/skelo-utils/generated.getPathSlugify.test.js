const {getPathSlugify} = require('../../lib/skelo-utils');

describe('getPathSlugify', () => {
  it('should return a slugified path', () => {
    expect(getPathSlugify('Hello World')).toBe('hello-world');
  });

  it('should handle multiple levels of directories', () => {
    expect(getPathSlugify('folder\\to\\me')).toBe('folder/to/me');
  });

  it('should throw an error for paths with special characters', () => {
    expect(() => getPathSlugify('Hello World!@#$%^&*()')).toThrowError();
  });

  it('should handle paths with non-ASCII characters', () => {
    expect(getPathSlugify('Café')).toBe('cafe');
  });

  it('should handle empty paths', () => {
    expect(getPathSlugify('')).toBe('');
  });

  it('should handle paths with trailing backslashes', () => {
    expect(getPathSlugify('folder\\to\\me\\')).toBe('folder/to/me');
  });

  it('should handle paths with redundant separators', () => {
    expect(getPathSlugify('folder\\\\to\\\\me')).toBe('folder/to/me');
  });

  it('should handle paths with mixed forward and backslashes', () => {
    expect(getPathSlugify('folder/to\\me')).toBe('folder/to/me');
  });

  it('should handle forward slashes as path separators', () => {
    expect(getPathSlugify('folder/to/me')).toBe('folder/to/me');
  });

  it('should handle backslashes as path separators', () => {
    expect(getPathSlugify('folder\\to\\me')).toBe('folder/to/me');
  });

  it('should handle null input', () => {
    expect(getPathSlugify(null)).toBe('');
  });

  it('should handle undefined input', () => {
    expect(getPathSlugify(undefined)).toBe('');
  });

  it('should handle non-string input', () => {
    expect(() => getPathSlugify(123)).toThrowError();
  });
});