// __tests__/skelo-utils/generated.buildCategory.test.js

const { buildCategory, buildSidebar } = require('../../lib/skelo-utils');
const path = require('path');

jest.mock('../../lib/skelo-utils', () => ({
  ...jest.requireActual('../../lib/skelo-utils'),
  buildSidebar: jest.fn(),
}));

describe('buildCategory', () => {
  test('should return a category object with label and items', () => {
    const sidebarItem = { id: 'category-1', label: 'Category 1', items: [{ id: 'item-1' }, { id: 'item-2' }] };
    const options = { parentPath: '/docs' };
    const expectedItems = [{ id: 'item-1' }, { id: 'item-2' }];
    buildSidebar.mockReturnValue(expectedItems);
    const expected = { type: 'category', label: 'Category 1', items: expectedItems };
    expect(buildCategory(sidebarItem, options)).toEqual(expected);
  });

  test('should use id as label if label is not provided', () => {
    const sidebarItem = { id: 'category-1', items: [{ id: 'item-1' }, { id: 'item-2' }] };
    const options = { parentPath: '/docs' };
    const expectedItems = [{ id: 'item-1' }, { id: 'item-2' }];
    buildSidebar.mockReturnValue(expectedItems);
    const expected = { type: 'category', label: 'category-1', items: expectedItems };
    expect(buildCategory(sidebarItem, options)).toEqual(expected);
  });

  test('should use slug as label if id and label are not provided', () => {
    const sidebarItem = { slug: 'category-1', items: [{ id: 'item-1' }, { id: 'item-2' }] };
    const options = { parentPath: '/docs' };
    const expectedItems = [{ id: 'item-1' }, { id: 'item-2' }];
    buildSidebar.mockReturnValue(expectedItems);
    const expected = { type: 'category', label: 'category-1', items: expectedItems };
    expect(buildCategory(sidebarItem, options)).toEqual(expected);
  });

  test('should call buildSidebar with correct options', () => {
    const sidebarItem = { id: 'category-1', items: [{ id: 'item-1' }, { id: 'item-2' }] };
    const options = { parentPath: '/docs' };
    buildCategory(sidebarItem, options);
    expect(buildSidebar).toHaveBeenCalledTimes(1);
    expect(buildSidebar).toHaveBeenCalledWith(sidebarItem.items, expect.objectContaining({ parentPath: path.join(options.parentPath, expect.any(String)) }));
  });
});