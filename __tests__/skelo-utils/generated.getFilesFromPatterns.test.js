const {getFilesFromPatterns} = require('../../lib/skelo-utils');
const globSync = require('glob').globSync;
const consoleErrorSpy = jest.spyOn(console, 'error');

describe('getFilesFromPatterns', () => {
  beforeEach(() => {
    consoleErrorSpy.mockClear();
  });

  test('should return an array of files for valid primary patterns', () => {
    const primaryPatterns = ['test/*.txt'];
    const fallbackPatterns = [];
    const expectedFiles = globSync(primaryPatterns);
    expect(getFilesFromPatterns(primaryPatterns, fallbackPatterns)).toEqual(expectedFiles);
  });

  test('should return an array of files for valid fallback patterns', () => {
    const primaryPatterns = [];
    const fallbackPatterns = ['test/*.txt'];
    const expectedFiles = globSync(fallbackPatterns);
    expect(getFilesFromPatterns(primaryPatterns, fallbackPatterns)).toEqual(expectedFiles);
  });

//   test('should throw an error for invalid primary patterns', () => {
//     const primaryPatterns = 123;
//     const fallbackPatterns = [];
//     expect(() => getFilesFromPatterns(primaryPatterns, fallbackPatterns)).toThrow();
//   });

//   test('should throw an error for invalid fallback patterns', () => {
//     const primaryPatterns = [];
//     const fallbackPatterns = 123;
//     expect(() => getFilesFromPatterns(primaryPatterns, fallbackPatterns)).toThrow();
//   });

  test('should return an empty array for empty primary patterns', () => {
    const primaryPatterns = [];
    const fallbackPatterns = [];
    expect(getFilesFromPatterns(primaryPatterns, fallbackPatterns)).toEqual([]);
  });

  test('should return an empty array for empty fallback patterns', () => {
    const primaryPatterns = ['test/*.txt'];
    const fallbackPatterns = [];
    expect(getFilesFromPatterns(primaryPatterns, fallbackPatterns)).toEqual([]);
  });

  test('should return an empty array for primary patterns with no matches', () => {
    const primaryPatterns = ['non-existent-pattern'];
    const fallbackPatterns = [];
    expect(getFilesFromPatterns(primaryPatterns, fallbackPatterns)).toEqual([]);
  });

  test('should return an empty array for fallback patterns with no matches', () => {
    const primaryPatterns = [];
    const fallbackPatterns = ['non-existent-pattern'];
    expect(getFilesFromPatterns(primaryPatterns, fallbackPatterns)).toEqual([]);
  });

  test('should return an array of files for primary patterns with matches', () => {
    const primaryPatterns = ['test/*.txt'];
    const fallbackPatterns = [];
    const expectedFiles = globSync(primaryPatterns);
    expect(getFilesFromPatterns(primaryPatterns, fallbackPatterns)).toEqual(expectedFiles);
  });

  test('should return an array of files for fallback patterns with matches', () => {
    const primaryPatterns = [];
    const fallbackPatterns = ['test/*.txt'];
    const expectedFiles = globSync(fallbackPatterns);
    expect(getFilesFromPatterns(primaryPatterns, fallbackPatterns)).toEqual(expectedFiles);
  });

//   test('should log an error for invalid patterns', () => {
//     const primaryPatterns = 123;
//     const fallbackPatterns = [];
//     getFilesFromPatterns(primaryPatterns, fallbackPatterns);
//     expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
//   });
});