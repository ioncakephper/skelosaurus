// Runnable unit tests in JavaScript

// Import the necessary functions or modules
const {normalizeItem} = require('./index');

describe('normalizeItem', () => {
// Test case for normalizing a string label
test('normalizeItem - normalize a string label', () => {
    const item = '  Item 1  ';
    const result = normalizeItem(item);
    expect(result).toEqual({ label: 'Item 1', items: [] });
});

// Test case for normalizing an object with label and items properties
test('normalizeItem - normalize an object with label and items properties', () => {
    const item = { label: '  Item 1  ', items: ['  Subitem 1  ', '  Subitem 2  '] };
    const result = normalizeItem(item);
    expect(result).toEqual({ label: 'Item 1', items: [{ label: 'Subitem 1', items: [] }, { label: 'Subitem 2', items: [] }] });
});

// Test case for throwing an error when item is not an object
test('normalizeItem - throw error when item is not an object', () => {
    const item = 123;
    expect(() => { normalizeItem(item) }).toThrow('Item must be an object');
});

// Test case for throwing an error when label is empty
test('normalizeItem - throw error when label is empty', () => {
    const item = { label: '' };
    expect(() => { normalizeItem(item) }).toThrow('Label must not be empty');
});

// Test case for normalizing items array
test('normalizeItem - normalize items array', () => {
    const item = { label: '  Item 1  ', items: ['  Subitem 1  ', '  Subitem 2  '] };
    const result = normalizeItem(item);
    expect(result.items).toEqual([{ label: 'Subitem 1', items: [] }, { label: 'Subitem 2', items: [] }]);
});

// Test case for throwing an error when items is not an array
test('normalizeItem - throw error when items is not an array', () => {
    const item = { label: 'Item 1', items: 'Subitem 1' };
    expect(() => { normalizeItem(item) }).toThrow('Items must be an array');
});

// Test case for normalizing headings array
test('normalizeItem - normalize headings array', () => {
    const item = { label: '  Item 1  ', items: ['  Subitem 1  ', '  Subitem 2  '], headings: ['  Heading 1  ', '  Heading 2  '] };
    const result = normalizeItem(item);
    expect(result.headings).toEqual([{ label: 'Heading 1', items: [] }, { label: 'Heading 2', items: [] }]);
});

// Test case for throwing an error when headings is not an array
test('normalizeItem - throw error when headings is not an array', () => {
    const item = { label: 'Item 1', items: ['Subitem 1'], headings: 'Heading 1' };
    expect(() => { normalizeItem(item) }).toThrow('Headings must be an array');
});

// Test case for returning undefined when item is undefined
test('normalizeItem - return undefined when item is undefined', () => {
    const item = undefined;
    const result = normalizeItem(item);
    expect(result).toBeUndefined();
});

// Test case for returning standard category when item is an object with label as key and its value is an array of items
test('normalizeItem - return standard category when item is an object with label as key and its value is an array of items', () => {
    const item = {'Item': ['Subitem 1', 'Subitem 2']};
    const result = normalizeItem(item);
    expect(result).toEqual({"items": [{"items": [], "label": "Subitem 1"}, {"items": [], "label": "Subitem 2"}], "label": "Item"});
})
})