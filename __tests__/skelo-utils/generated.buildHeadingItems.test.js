// Runnable unit tests in JavaScript
const assert = require('assert');

// Import the function to be tested
const {buildHeadingItems} = require('../../lib/skelo-utils');

// Test case: Testing with items and default level
assert.strictEqual(
  buildHeadingItems([{ label: 'Item 1' }, { label: 'Item 2' }]),
  '## Item 1\r\n\n## Item 2\r\n'
);

test('Testing with items default level', () => {

  expect(buildHeadingItems([{ label: 'Item 1' }, { label: 'Item 2' }])).toEqual('## Item 1\r\n\n## Item 2\r\n');
});

// Test case: Testing with items and custom level
assert.strictEqual(
  buildHeadingItems([{ label: 'Item 1' }, { label: 'Item 2' }], 3),
  '### Item 1\r\n\n### Item 2\r\n'
);

// Test case: Testing with empty items
assert.strictEqual(
  buildHeadingItems([]),
  ''
);

// Test case: Testing with null items
assert.strictEqual(
  buildHeadingItems(null),
  undefined
);

// Test case: Testing with undefined items
assert.strictEqual(
  buildHeadingItems(undefined),
  undefined
);