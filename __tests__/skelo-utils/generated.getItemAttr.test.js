
const assert = require('assert');

const {getItemAttr} = require('../../lib/skelo-utils');

describe('getItemAttr', function() {
  it('should retrieve attributes of an item with no "label" and "items" attributes', function() {
    const inputItem = { name: 'example', value: 123 };
    const expectedOutput = { name: 'example', value: 123 };
    assert.deepStrictEqual(getItemAttr(inputItem), expectedOutput);
  });

  it('should retrieve attributes of an item with "label" and "items" attributes', function() {
    const inputItem = { name: 'example', value: 123, label: 'example label', items: [] };
    const expectedOutput = { name: 'example', value: 123 };
    assert.deepStrictEqual(getItemAttr(inputItem), expectedOutput);
  });

  it('should retrieve attributes of an empty item', function() {
    const inputItem = {};
    const expectedOutput = {};
    assert.deepStrictEqual(getItemAttr(inputItem), expectedOutput);
  });
});