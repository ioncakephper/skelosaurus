// Runnable unit tests in javascript
const assert = require('assert');
const { buildCategory, normalizeItem } = require('../../lib/skelo-utils');

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
  }, /Items must be an array/);
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

it('should build a category object with link attribute whose value is an object with type properties', () => {
  const item = {
    label: 'Test Category',
    items: [normalizeItem('Test Item')],
    'generated_index': true
  };
  const options = { customOption: 'value' };
  const result = buildCategory(item, options);
  assert.deepStrictEqual(result, {
    label: 'Test Category',
    type: 'category',
    items: ['test-item'],
    link: {
      type: 'generated-index',
      // description: 'Test Category'
    }
  });
});

it('should build a category object with link attribute whose value is an obkect with type and description properties', () => {
  const item = {
    label: 'Test Category',
    items: [normalizeItem('Test Item')],
    brief: 'Test Category Brief',
    'generated_index': true
  };
  const options = { customOption: 'value' };
  const result = buildCategory(item, options);
  assert.deepStrictEqual(result, {
    label: 'Test Category',
    type: 'category',
    items: ['test-item'],
    link: {
      type: 'generated-index',
      description: 'Test Category Brief'
    }
  });
});

it('should build a category with an item that that is an object with type and value. The type is html and value is the string of the html property ', () => {
  const item = {
    label: 'Test Category',
    items: [normalizeItem({label: 'HTML Item', items: [], 'html': '<p>code</p>'})],
  }
  const options = { customOption: 'value' };
  const result = buildCategory(item, options);
  assert.deepStrictEqual(result, {
    label: 'Test Category',
    type: 'category',
    items: [
      {
        type: 'html',
        value: '<p>code</p>'
      }
    ]
  })
});

it('should build a category with an item that that is an object with type, label, and href. The type is link, the label is the item label, and href is the value of href property', () => {
  const item = {
    label: 'Test Category',
    items: [normalizeItem({label: 'HTML Link', items: [], 'href': 'https://mycompany.com'})],
  }
  const options = { customOption: 'value' };
  const result = buildCategory(item, options);
  assert.deepStrictEqual(result, {
    label: 'Test Category',
    type: 'category',
    items: [
      {
        type: 'link',
        label: 'HTML Link',
        href: 'https://mycompany.com'
      }
    ]
  })
});






