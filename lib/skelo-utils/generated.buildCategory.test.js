// Runnable unit tests in javascript
const assert = require('assert');
const { buildCategory, normalizeItem } = require('./index');

// Test for a valid item object and options
it('should build a category object from the item and options', () => {
  const item = {
    label: 'Test Category',
    items: [normalizeItem('Test Item')]
  };
  const options = { customOption: 'value' };
  const result = buildCategory(item, options);
  assert.deepStrictEqual(result, {
    label: 'Test Category',
    type: 'category',
    items: ['test-item']
  });
});

// Test for a null or undefined item object
it('should throw an error if item is null or undefined', () => {
  const item = { label: 'Test Category' };
  assert.throws(() => {
    buildCategory(item);
  }, /Items must not be null or undefined/);
});

// Test for custom options
it('should build a category object with custom options', () => {
  const item = {
    label: 'Test Category',
    items: [normalizeItem('Test Item')]
  };
  const options = { customOption: 'value' };
  const result = buildCategory(item, options);
  assert.deepStrictEqual(result, {
    label: 'Test Category',
    type: 'category',
    items: ['test-item']
  });
});

// Test for custom options with a different label
it('should build a category object with custom options and a different label', () => {
  const item = {
    label: 'Test Category',
    items: [normalizeItem('Test Item')]
  };
  const options = { customOption: 'value' };
  const result = buildCategory(item, options);
  assert.deepStrictEqual(result, {
    label: 'Test Category',
    type: 'category',
    items: ['test-item']
  });
});