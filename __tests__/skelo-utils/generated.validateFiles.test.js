const validateFiles = require('../../lib/skelo-utils').validateFiles;
const yamljs = require('yamljs');
const jsonschema = require('jsonschema');

describe('validateFiles', () => {
  test('throws an error when filenames is not an array of strings', () => {
    expect(() => validateFiles('not an array', {})).toThrowError('filenames is required and must be an array of strings');
  });

  test('throws an error when jsonSchema is not an object', () => {
    expect(() => validateFiles([], 'not an object')).toThrowError('jsonSchema is required');
    expect(() => validateFiles([], null)).toThrowError('jsonSchema is required');
  });

  test('returns an object with valid and invalid properties when validation succeeds', () => {
    const filenames = ['file1.yml', 'file2.yml'];
    const jsonSchema = {
      type: 'object',
      properties: {
        label: { type: 'string' },
        slug: { type: 'string' },
        items: { type: 'array' }
      },
      required: ['label', 'slug', 'items']
    };
    const result = validateFiles(filenames, jsonSchema);
    expect(result).toEqual({ valid: [], invalid: ['file1.yml', 'file2.yml'] });
  });

  test('correctly validates files against a JSON schema', () => {
    const filenames = ['file1.yml', 'file2.yml'];
    const jsonSchema = {
      type: 'object',
      properties: {
        label: { type: 'string' },
        slug: { type: 'string' },
        items: { type: 'array' }
      },
      required: ['label', 'slug', 'items']
    };
    const file1Content = { label: 'file1', slug: 'file1', items: [] };
    const file2Content = { label: 'file2', slug: 'file2', items: ['item1'] };
    yamljs.load = jest.fn((filename) => {
      if (filename === 'file1.yml') return file1Content;
      if (filename === 'file2.yml') return file2Content;
    });
    const result = validateFiles(filenames, jsonSchema);
    expect(result).toEqual({ valid: ['file1.yml', 'file2.yml'], invalid: [] });
  });

  test('handles empty files correctly', () => {
    const filenames = ['file1.yml', 'file2.yml'];
    const jsonSchema = {
      type: 'object',
      properties: {
        label: { type: 'string' },
        slug: { type: 'string' },
        items: { type: 'array' }
      },
      required: ['label', 'slug', 'items']
    };
    yamljs.load = jest.fn((filename) => {
      if (filename === 'file1.yml') return null;
      if (filename === 'file2.yml') return { label: 'file2', slug: 'file2', items: [] };
    });
    const result = validateFiles(filenames, jsonSchema);
    expect(result).toEqual({ valid: ['file2.yml'], invalid: ['file1.yml'] });
  });

  test('handles invalid files correctly', () => {
    const filenames = ['file1.yml', 'file2.yml'];
    const jsonSchema = {
      type: 'object',
      properties: {
        label: { type: 'string' },
        slug: { type: 'string' },
        items: { type: 'array' }
      },
      required: ['label', 'slug', 'items']
    };
    yamljs.load = jest.fn((filename) => {
      if (filename === 'file1.yml') return { label: 'file1', slug: 'file1' };
      if (filename === 'file2.yml') return { label: 'file2', slug: 'file2', items: [] };
    });
    const result = validateFiles(filenames, jsonSchema);
    expect(result).toEqual({ valid: ['file2.yml'], invalid: ['file1.yml'] });
  });
});