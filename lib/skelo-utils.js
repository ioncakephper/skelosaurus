
const fs = require('fs');
const { globSync } = require('glob');
const { type } = require('os');


// TODO: Generate unit tests: isValidPattern

/**
 * Validates the given pattern.
 *
 * @param {string} pattern - The pattern to validate. Expected to be a regex string.
 * @returns {boolean} - Returns true if the pattern is valid, otherwise false.
 */
function isValidPattern(pattern) {
    if (pattern == null || typeof pattern !== 'string' || pattern.includes('<script>')) {
        console.warn(`Invalid pattern: ${pattern}`);
        return false;
    }
    // TODO: Add correct regex matching globSync acceptable patterns
    // const regex = /^[a-zA-Z0-9\s\.\[\]\_\-\/\*\?]+$/; // Matches typical glob patterns
    // return regex.test(pattern);
    return true
}

// TODO: Generate unit tests: getFilesFromPatterns

/**
 * Retrieves files matching the specified patterns using glob syntax.
 *
 * The function first validates the provided patterns to ensure they are either strings or arrays of strings.
 * It then attempts to find files matching the primary patterns. If no files are found, it uses the fallback patterns.
 * If an error occurs during pattern validation or file matching, it logs the error and returns an empty array.
 *
 * @param {Array|string} primaryPatterns - The primary patterns to match files against.
 * @param {Array|string} fallbackPatterns - The fallback patterns to use if no files match the primary patterns.
 * @returns {Array} An array of file paths that match the provided patterns.
 * @throws Will throw an error if the patterns are not valid strings or arrays of strings.
 *
 */
function getFilesFromPatterns(primaryPatterns = [], fallbackPatterns = []) {
    const validatePatterns = (patterns, patternType) => {
        if (!Array.isArray(patterns) && typeof patterns !== 'string') {
            console.error(`Invalid patterns: ${patterns}`);
            throw new Error('Patterns must be an array or a string');
        }
        // Additional validation logic to sanitize patterns
        if (Array.isArray(patterns)) {
            patterns.forEach(pattern => {
                if (typeof pattern !== 'string' || !isValidPattern(pattern)) {
                    throw new Error(`Invalid pattern in ${patternType}: ${pattern}`);
                }
            });
        } else if (!isValidPattern(patterns)) {
            throw new Error(`Invalid pattern in ${patternType}: ${patterns}`);
        }
    };

    try {
        validatePatterns(primaryPatterns, 'primaryPatterns');
        validatePatterns(fallbackPatterns, 'fallbackPatterns');

        let matchedFiles = globSync(primaryPatterns);
        if (matchedFiles.length === 0) {
            matchedFiles = globSync(fallbackPatterns);
        }
        return matchedFiles;
    } catch (error) {
        console.error('Error occurred while processing patterns:', error);
        return [];
    }
}

function normalizeItem(item) {

    if (item === null || item === undefined ) {
        throw new Error(`Invalid item: ${item}`);
    }

    if (typeof item !== 'object') {
        if (typeof item === 'string') {
            return normalizeItem({ label: item });
        }
        throw new Error(`Invalid item: ${item}`);
    }

    if (!item.hasOwnProperty('label')) {
        console.log("🚀 ~ normalizeItem ~ item:", item.hasOwnProperty('label'))
        const firstKey = Object.keys(item)[0];
        if (!Array.isArray(item[firstKey])) {
            throw new Error(`Invalid item: first property value must be an array: ${item}`);
        }

        return normalizeItem({ label: firstKey, items: item[firstKey] });
    }

    item.label = item.label.trim();
    if (item.label === '') {
        throw new Error('Label cannot be an empty string');
    }

    if (item.items !== undefined && !Array.isArray(item.items)) {
        throw new Error('Item property must be an array');
    }
    if (item.headings !== undefined && !Array.isArray(item.headings)) {
        throw new Error('Headings property must be an array');
    }

    if (item.items !== undefined && item.headings !== undefined) {
        throw new Error('Cannot have both items and headings properties');
    }

    if (item.items) {
        item.items = item.items.map(normalizeItem);
    }

    if (item.headings) {
        item.headings = item.headings.map(normalizeItem);
    }

    return item;
}

function findDuplicatedSidebars(files) {
    const sidebars = files.map(file => yamljs.load(file).sidebars).flat();
    const uniqueSidebars = new Set(sidebars);
    const duplicatedSidebars = sidebars.filter(sidebar => !uniqueSidebars.has(sidebar));
    return duplicatedSidebars;
}


// TODO: Double-check sorted export items
module.exports = {
    findDuplicatedSidebars,
    getFilesFromPatterns,
    normalizeItem,
    isValidPattern,
}