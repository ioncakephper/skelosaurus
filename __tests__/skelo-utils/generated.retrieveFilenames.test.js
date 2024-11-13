const { retrieveFilenames } = require('../../lib/skelo-utils');

describe('retrieveFilenames', () => {
  test('should throw an error if primary pattern is not provided', () => {
    expect(() => retrieveFilenames(null, 'fallback-pattern')).toThrowError('Primary pattern is required');
  });

  test('should throw an error if fallback pattern is not provided', () => {
    expect(() => retrieveFilenames('primary-pattern', null)).toThrowError('Fallback pattern is required');
  });

  test('should return matched files if primary pattern is an array', () => {
    const primaryPattern = ['pattern1', 'pattern2'];
    const fallbackPattern = 'fallback-pattern';
    const matchedFiles = retrieveFilenames(primaryPattern, fallbackPattern);
    expect(Array.isArray(matchedFiles)).toBeTruthy();
  });

  test('should return matched files if primary pattern is a string', () => {
    const primaryPattern = 'primary-pattern';
    const fallbackPattern = 'fallback-pattern';
    const matchedFiles = retrieveFilenames(primaryPattern, fallbackPattern);
    expect(Array.isArray(matchedFiles)).toBeTruthy();
  });

  test('should return matched files if fallback pattern is an array', () => {
    const primaryPattern = 'primary-pattern';
    const fallbackPattern = ['pattern1', 'pattern2'];
    const matchedFiles = retrieveFilenames(primaryPattern, fallbackPattern);
    expect(Array.isArray(matchedFiles)).toBeTruthy();
  });

  test('should return matched files if fallback pattern is a string', () => {
    const primaryPattern = 'primary-pattern';
    const fallbackPattern = 'fallback-pattern';
    const matchedFiles = retrieveFilenames(primaryPattern, fallbackPattern);
    expect(Array.isArray(matchedFiles)).toBeTruthy();
  });

  describe('should return matched files if primary pattern matches files', () => {
    test('should return matched files if primary pattern matches files in a string', () => {
        const primaryPattern = '*.js';
        const fallbackPattern = 'fallback-pattern';
        const matchedFiles = retrieveFilenames(primaryPattern, fallbackPattern);
        expect(matchedFiles.length).toBeGreaterThan(0);
      });
    
      test('should return matched files if primary pattern matches files in an array', () => {
        const primaryPattern = ['*.js'];
        const fallbackPattern = 'fallback-pattern';
        const matchedFiles = retrieveFilenames(primaryPattern, fallbackPattern);
        expect(matchedFiles.length).toBeGreaterThan(0);
      });
  })


  test('should return matched files if primary pattern does not match files, fallback pattern matches files', () => {
    const primaryPattern = 'non-existent-pattern';
    const fallbackPattern = '*.js';
    const matchedFiles = retrieveFilenames(primaryPattern, fallbackPattern);
    expect(matchedFiles.length).toBeGreaterThan(0);
  });

  test('should return an empty array if primary pattern does not match files, fallback pattern does not match files', () => {
    const primaryPattern = 'non-existent-pattern';
    const fallbackPattern = 'non-existent-fallback-pattern';
    const matchedFiles = retrieveFilenames(primaryPattern, fallbackPattern);
    expect(matchedFiles).toEqual([]);
  });

  describe('should return matched files if primary pattern is an empty array', () => {
    test('should return matched files if primary pattern is an empty array and fallback pattern is a string that matches files', () => {
        const primaryPattern = [];
        const fallbackPattern = '*.js';
        const matchedFiles = retrieveFilenames(primaryPattern, fallbackPattern);
        expect(matchedFiles.length).toBeGreaterThan(0);
      });
    
      test('should return matched files if primary pattern is an empty array and fallback pattern is an array with patterns that match files', () => {
        const primaryPattern = [];
        const fallbackPattern = ['*.js', '*.ts'];
        const matchedFiles = retrieveFilenames(primaryPattern, fallbackPattern);
        expect(matchedFiles.length).toBeGreaterThan(0);
      });
  })
});