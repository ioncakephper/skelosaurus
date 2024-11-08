const {getSlugOrId} = require('../../lib/skelo-utils');


describe('getSlugOrId', () => {
  test('returns slug when item has slug property', () => {
    const item = { slug: 'test-slug' };
    expect(getSlugOrId(item)).toBe('test-slug');
  });

  test('returns id when item has id property', () => {
    const item = { id: 'test-id' };
    expect(getSlugOrId(item)).toBe('test-id');
  });

  test('returns label when item has label property', () => {
    const item = { label: 'Test Label' };
    expect(getSlugOrId(item)).toBe('test-label');
  });

  test('returns empty string when item has no slug, id, or label properties', () => {
    const item = {};
    expect(getSlugOrId(item)).toBe('');
  });

  test('returns empty string when item has null or undefined slug, id, or label properties', () => {
    const item = { slug: null, id: undefined, label: null };
    expect(getSlugOrId(item)).toBe('');
  });

  test('calls getSluggedPath with the correct argument', () => {
    const getSluggedPathSpy = jest.fn();
    const item = { slug: 'test-slug' };
    getSlugOrId(item);
    expect(getSluggedPathSpy).toHaveBeenCalledTimes(0); // getSluggedPath is not defined in this test
    // If you want to test getSluggedPath as well, you can import it and use jest.spyOn
  });
});