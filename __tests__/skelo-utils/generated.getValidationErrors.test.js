const fs = require('fs');
const { globSync } = require('glob');
const validate = require('jsonschema');
const path = require('path');
const yamljs = require('yamljs');
const {getValidationErrors} = require('../../lib/skelo-utils');

describe('getValidationErrors', () => {
    test('returns an empty array when file is valid', async () => {
      // Arrange
      const filePath = 'path/to/valid/file.yaml';
      const schema = {
        type: 'object',
        properties: {
          foo: { type: 'string' },
        },
        required: ['foo'],
      };
      const fileContent = 'foo: bar';
      const parsedContent = { foo: 'bar' };
      const validationResult = { errors: [] };
  
      jest.spyOn(fs, 'readFileSync').mockReturnValue(fileContent);
      jest.spyOn(yamljs, 'parse').mockReturnValue(parsedContent);
      jest.spyOn(validate, 'validate').mockReturnValue(validationResult);
  
      // Act
      const result = await getValidationErrors(filePath, schema);
  
      // Assert
      expect(result).toEqual([]);
    });
  
    test('returns an array of errors when file is invalid', async () => {
      // Arrange
      const filePath = 'path/to/invalid/file.yaml';
      const schema = {
        type: 'object',
        properties: {
          foo: { type: 'string' },
        },
        required: ['foo'],
      };
      const fileContent = 'foo: 123';
      const parsedContent = { foo: 123 };
      const validationResult = [{ message: 'Invalid type' }];
  
      jest.spyOn(fs, 'readFileSync').mockReturnValue(fileContent);
      jest.spyOn(yamljs, 'parse').mockReturnValue(parsedContent);
      jest.spyOn(validate, 'validate').mockReturnValue(validationResult);
  
      // Act
      const result = await getValidationErrors(filePath, schema);
  
      // Assert
      expect(result).toEqual([{ message: 'Invalid type' }]);
    });
  
    test('throws an error when file is empty or cannot be read', async () => {
      // Arrange
      const filePath = 'path/to/empty/file.yaml';
      const schema = {
        type: 'object',
        properties: {
          foo: { type: 'string' },
        },
        required: ['foo'],
      };
      const fileContent = '';
  
      jest.spyOn(fs, 'readFileSync').mockReturnValue(fileContent);
  
      // Act and Assert
      await expect(getValidationErrors(filePath, schema)).rejects.toThrowError(`File ${filePath} is empty or cannot be read`);
    });
  
    test('throws an error when file cannot be parsed', async () => {
      // Arrange
      const filePath = 'path/to/invalid/file.yaml';
      const schema = {
        type: 'object',
        properties: {
          foo: { type: 'string' },
        },
        required: ['foo'],
      };
      const fileContent = ' invalid yaml';
  
      jest.spyOn(fs, 'readFileSync').mockReturnValue(fileContent);
      jest.spyOn(yamljs, 'parse').mockReturnValue(null);
  
      // Act and Assert
      await expect(getValidationErrors(filePath, schema)).rejects.toThrowError(`Failed to parse YAML content from ${filePath}`);
    });
  
    test('throws an error when filePath is not a non-empty string', async () => {
      // Arrange
      const filePath = '';
      const schema = {
        type: 'object',
        properties: {
          foo: { type: 'string' },
        },
        required: ['foo'],
      };
  
      // Act and Assert
      await expect(getValidationErrors(filePath, schema)).rejects.toThrowError('Invalid arguments: filePath and schema are required');
    });
  
    test('throws an error when schema is not a non-null object', async () => {
      // Arrange
      const filePath = 'path/to/file.yaml';
      const schema = null;
  
      // Act and Assert
      await expect(getValidationErrors(filePath, schema)).rejects.toThrowError('Invalid arguments: filePath and schema are required');
    });
  });