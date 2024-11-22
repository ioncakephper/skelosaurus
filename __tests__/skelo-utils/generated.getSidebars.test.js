const fs = require('fs');
const yamljs = require('yamljs');
const { getSidebars, normalizeItem } = require('../../lib/skelo-utils');

jest.mock('fs');
jest.mock('yamljs');

describe('getSidebars', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return an empty array if file does not exist', () => {
    fs.readFileSync.mockImplementationOnce(() => {
      throw new Error('File not found');
    });
    const result = getSidebars('non-existent-file.yml');
    expect(result).toEqual([]);
    expect(console.error).toHaveBeenCalledTimes(1);
  });

  it('should return an empty array if file is empty', () => {
    fs.readFileSync.mockImplementationOnce(() => '');
    const result = getSidebars('empty-file.yml');
    expect(result).toEqual([]);
  });

  it('should return an empty array if file is not valid YAML', () => {
    fs.readFileSync.mockImplementationOnce(() => 'Invalid YAML');
    yamljs.parse.mockImplementationOnce(() => {
      throw new Error('Invalid YAML');
    });
    const result = getSidebars('invalid-yaml-file.yml');
    expect(result).toEqual([]);
    expect(console.error).toHaveBeenCalledTimes(1);
  });

  it('should return an empty array if sidebars section is missing', () => {
    fs.readFileSync.mockImplementationOnce(() => 'valid YAML');
    yamljs.parse.mockImplementationOnce(() => ({}));
    const result = getSidebars('missing-sidebars.yml');
    expect(result).toEqual([]);
  });

  it('should return an array of normalized sidebar items', () => {
    fs.readFileSync.mockImplementationOnce(() => 'valid YAML');
    yamljs.parse.mockImplementationOnce(() => ({
      sidebars: [
        { label: 'Sidebar 1', items: ['Item 1', 'Item 2'] },
        { label: 'Sidebar 2', items: ['Item 3', 'Item 4'] },
      ],
    }));
    normalizeItem.mockImplementation((item) => item);
    const result = getSidebars('valid-sidebars.yml');
    expect(result).toEqual([
      { label: 'Sidebar 1', items: ['Item 1', 'Item 2'] },
      { label: 'Sidebar 2', items: ['Item 3', 'Item 4'] },
    ]);
  });
});
