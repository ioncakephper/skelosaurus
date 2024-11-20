const fs = require('fs');
const path = require('path');
const yamljs = require('yamljs');
const {markdownToYaml} = require('../../lib/skelo-utils/markdown2outline');

jest.mock('fs', () => ({
    readFileSync: jest.fn(),
    writeFileSync: jest.fn(),
  }));
  
  jest.mock('../../lib/skelo-utils/markdown2outline', () => ({
    md2outline: jest.fn(),
  }));
  
  describe('markdownToYaml', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    test('throws an error when sourceMarkdownFilename is not provided', () => {
      expect(() => markdownToYaml()).toThrow(TypeError);
    });
  
    test('throws an error when sourceMarkdownFilename is not a string', () => {
      expect(() => markdownToYaml(123)).toThrow(TypeError);
    });
  
    test('throws an error when sourceMarkdownFilename is empty', () => {
      expect(() => markdownToYaml('')).toThrow(TypeError);
    });
  
    test('appends .md extension to sourceMarkdownFilename if not provided', () => {
      markdownToYaml('test');
      expect(fs.readFileSync).toHaveBeenCalledWith('test.md', 'utf8');
    });
  
    test('generates targetYamlFilename if not provided', () => {
      markdownToYaml('test.md');
      // Verify that writeFileSync is called exactly once
      expect(fs.writeFileSync).toHaveBeenCalledTimes(1);

      // Verify that writeFileSync is called with 'test.yaml' as the filename
      // and any string as content, using 'utf8' encoding
      expect(fs.writeFileSync).toHaveBeenCalledWith('test.yaml', expect.any(String), 'utf8');
    });
  
    test('throws an error when targetYamlFilename contains path traversal characters', () => {
      expect(() => markdownToYaml('test.md', '../test.yaml')).toThrow(Error);
    });
  
    test('appends .yaml extension to targetYamlFilename if not provided', () => {
      markdownToYaml('test.md', 'test');
      expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
      expect(fs.writeFileSync).toHaveBeenCalledWith('test.yaml', expect.any(String), 'utf8');
    });
  
    test('reads markdown file and converts to YAML', () => {
      const markdownContent = '## Test';
      fs.readFileSync.mockImplementationOnce((filename, encoding) => markdownContent);
      markdownToYaml('test.md');
      expect(yamljs.stringify).toHaveBeenCalledTimes(1);
      expect(yamljs.stringify).toHaveBeenCalledWith(expect.any(Object), 2, 4);
    });
  
    test('writes YAML content to file', () => {
      const yamlContent = 'test: yaml';
      yamljs.stringify.mockImplementationOnce(() => yamlContent);
      markdownToYaml('test.md');
      expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
      expect(fs.writeFileSync).toHaveBeenCalledWith('test.yaml', yamlContent, 'utf8');
    });
  
    test('handles errors during file processing', () => {
      const error = new Error('Mock error');
      fs.readFileSync.mockImplementationOnce(() => { throw error; });
      markdownToYaml('test.md');
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith('An error occurred during file processing:', error);
    });
  });