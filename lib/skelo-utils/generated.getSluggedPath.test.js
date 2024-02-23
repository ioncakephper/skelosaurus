const assert = require('assert');

const { getSluggedPath } = require('./index');

describe('getSluggedPath', function() {
  it('should return a slugged path for a single string input', function() {
    const input = 'This is a test path';
    const expected = 'this-is-a-test-path';
    assert.strictEqual(getSluggedPath(input), expected);
  });

  it('should return a slugged path for an array of strings input', function() {
    const input = ['This', 'is', 'a', 'test', 'path'];
    const expected = 'this/is/a/test/path';
    assert.strictEqual(getSluggedPath(input), expected);
  });

  it('should return a slugged path for an array with special characters and spaces', function() {
    const input = ['This !is', 'a', 'test', 'path with spaces'];
    const expected = 'this-is/a/test/path-with-spaces';
    assert.strictEqual(getSluggedPath(input), expected);
  });

  test('Throw exception when input is not a string or an array', () => {
    const input = 123;
    expect(() => { getSluggedPath(input) }).toThrow('Path must be a string or an array');
  });
});