const assert = require('assert');

const {addExtensionIfMissing} = require('./index');

describe('addExtensionIfMissing', () => {
  it('should not add extension if basename already has the provided extension', () => {
    const result = addExtensionIfMissing('file.txt', '.txt');
    assert.strictEqual(result, 'file.txt');
  });

  it('should add extension if basename does not have the provided extension', () => {
    const result = addExtensionIfMissing('file', '.txt');
    assert.strictEqual(result, 'file.txt');
  });

  it('should return basename if it ends with a period', () => {
    const result = addExtensionIfMissing('file.', '.txt');
    assert.strictEqual(result, 'file.');
  });

  it('should return basename if extension is empty', () => {
    const result = addExtensionIfMissing('file', '');
    assert.strictEqual(result, 'file');
  });

  it('should trim leading/trailing whitespaces from basename and extension', () => {
    const result = addExtensionIfMissing(' file ', ' .txt ');
    assert.strictEqual(result, 'file.txt');
  });
});