const {slugify} = require('../../lib/skelo-utils')

describe('slugify', () => {
  it('should convert to lowercase', () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it('should remove diacritics', () => {
    expect(slugify("Café")).toBe("cafe");
  });

  it('should collapse whitespace and replace with hyphens', () => {
    expect(slugify(" Foo Bar ")).toBe("foo-bar");
  });

  it('should trim hyphens from the start and end', () => {
    expect(slugify(" - Foo Bar - ")).toBe("foo-bar");
  });

  it('should handle empty input', () => {
    expect(slugify("")).toBe("");
  });

  it('should handle null or undefined input', () => {
    expect(slugify(null)).toEqual('');
    expect(slugify(undefined)).toEqual('');
  });

  it('should handle non-string input', () => {
    expect(slugify(123)).toEqual('123');
  });
});