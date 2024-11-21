

const fs = require('fs');
const { globSync } = require('glob');
const { validate } = require('jsonschema');
const path = require('path');
const yamljs = require('yamljs');



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


/**
 * Validates a YAML file against a given schema.
 *
 * @param {string} filePath path to a YAML file
 * @param {object} schema the JSON schema to validate against
 * @return {Array.<Error>} an array of validation errors, or an empty array if the file is valid
 */
function getValidationErrors(filePath, schema) {
    try {
        if (!filePath || !schema) {
            throw new Error('Invalid arguments: filePath and schema are required');
        }

        const content = fs.readFileSync(filePath, 'utf8');
        if (!content) {
            throw new Error(`File at ${filePath} is empty or cannot be read`);
        }

        const parsedContent = yamljs.parse(content);
        if (!parsedContent) {
            throw new Error(`Failed to parse YAML content from ${filePath}`);
        }

        const validationResult = validate(parsedContent, schema);
        if (!validationResult || !validationResult.errors) {
            throw new Error('Unexpected validation result format');
        }

        return validationResult.errors.length > 0 ? validationResult.errors : [];
    } catch (error) {
        console.error(`Error processing file ${filePath}:`, error.message);
        return [];
    }
}

/**
 * Validates an array of YAML files against a specified schema and returns valid and invalid files.
 *
 * The function checks each file in the array against the provided JSON schema. It categorizes files
 * into valid and invalid based on the presence of validation errors. If any file cannot be read or parsed,
 * an error message is included in the invalid files.
 *
 * @param {Array} files - An array of file paths to be validated.
 * @param {object} options - Options for validation, including the schema path.
 * @returns {object} An object containing two arrays: `validFiles` and `invalidFiles`.
 *                    `validFiles` - An array of file paths that passed validation.
 *                    `invalidFiles` - An object where keys are file paths and values are arrays of error messages for files that failed validation.
 * @throws Will throw an error if `files` is not an array or is empty, or if the schema file cannot be found.
 */
function validateFiles(files, options) {
    if (!Array.isArray(files) || files.length === 0) {
        throw new Error('Files is not an array or is empty');
    }

    const schema = require(options.schema);
    if (!schema) {
        throw new Error(`Schema file not found: ${options.schema}`);
    }

    const invalidFiles = files.reduce((validationErrors, filePath) => {
        try {
            const errors = getValidationErrors(filePath, schema);
            if (errors.length > 0) {
                validationErrors[filePath] = errors;
            }
        } catch (error) {
            console.error(`Error processing file ${filePath}:`, error.message);
            validationErrors[filePath] = [{message: error.message}];
        }
        return validationErrors;
    }, {});

    const validFiles = files.filter(filePath => !invalidFiles[filePath]);

    return { validFiles, invalidFiles };
}

// TODO: Double-check sorted export items
module.exports = {
    findDuplicatedSidebars,
    getFilesFromPatterns,
    isValidPattern,
    normalizeItem,
    getValidationErrors,
    validateFiles,
}