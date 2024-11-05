
const { slug } = require('../../lib/skelo-utils');
describe('slug', () => {
  test('should return an empty string for empty input', () => {
    expect(slug('')).toBe('');
  });

  test('should trim leading and trailing whitespaces', () => {
    expect(slug('   Hello World   ')).toBe('hello-world');
  });

  test('should remove special characters', () => {
    expect(slug('Hello! World@#')).toBe('hello-world');
  });

  test('should replace multiple consecutive special characters with a single hyphen', () => {
    expect(slug('Hello!!! World@@@')).toBe('hello-world');
  });

  test('should keep numbers in the slug', () => {
    expect(slug('Hello 123 World')).toBe('hello-123-world');
  });

  test('should not remove existing hyphens', () => {
    expect(slug('Hello-World')).toBe('hello-world');
  });

  test('should throw an error for null input', () => {
    expect(() => slug(null)).toThrow(TypeError);
  });

  test('should throw an error for undefined input', () => {
    expect(() => slug(undefined)).toThrow(TypeError);
  });
});
