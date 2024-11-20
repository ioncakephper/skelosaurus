const {md2outline} = require('../../lib/skelo-utils/markdown2outline');

describe('md2outline', () => {
  test('should return empty outline for empty markdown text', () => {
    const markdownText = '';
    const expectedOutline = { sidebars: [] };
    expect(md2outline(markdownText)).toEqual(expectedOutline);
  });

  test('should extract single h2 header with no paragraph or list', () => {
    const markdownText = '## Heading';
    const expectedOutline = { sidebars: [{ label: 'Heading' }] };
    expect(md2outline(markdownText)).toEqual(expectedOutline);
  });

  test('should extract single h2 header with paragraph', () => {
    const markdownText = '## Heading\n\nThis is a paragraph.';
    const expectedOutline = { sidebars: [{ label: 'Heading', brief: 'This is a paragraph.' }] };
    expect(md2outline(markdownText)).toEqual(expectedOutline);
  });

  test('should extract single h2 header with list', () => {
    const markdownText = '## Heading\n\n* Item 1\n* Item 2';
    const expectedOutline = { sidebars: [{ label: 'Heading', items: ['Item 1', 'Item 2'] }] };
    expect(md2outline(markdownText)).toEqual(expectedOutline);
  });

  test('should extract multiple h2 headers with paragraphs and lists', () => {
    const markdownText = '## Heading 1\n\nThis is a paragraph.\n\n* Item 1\n* Item 2\n\n## Heading 2\n\nThis is another paragraph.\n\n';
    const expectedOutline = {
      sidebars: [
        { label: 'Heading 1', brief: 'This is a paragraph.', items: ['Item 1', 'Item 2'] },
        { label: 'Heading 2', brief: 'This is another paragraph.' }
      ]
    };
    expect(md2outline(markdownText)).toEqual(expectedOutline);
  });

  test('should return empty outline for markdown text with no h2 headers', () => {
    const markdownText = 'This is a paragraph.';
    const expectedOutline = { sidebars: [] };
    expect(md2outline(markdownText)).toEqual(expectedOutline);
  });
});