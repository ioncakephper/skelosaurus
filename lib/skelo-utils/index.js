const { saveDocument } = require('file-easy');
const fs = require('fs');
const { globSync } = require('glob');
const hbsr = require('hbsr');
const { isArray } = require('lodash');
const path = require('path');
const yamljs = require('yamljs');

/**
 * Appends the specified extension to the basename if it is not already present.
 *
 * This function checks if the basename and extension are strings, trimming any
 * whitespace from both. If the extension does not start with a period, one is
 * added. If the basename already ends with a period, it is returned unchanged.
 * Otherwise, the function appends the extension to the basename if it is not
 * already present.
 *
 * @param {string} basename - The base name to which the extension should be added.
 * @param {string} extension - The extension to add to the basename.
 * @returns {string} The basename with the extension appended if it was missing.
 * @throws {TypeError} If either the basename or extension is not a string.
 */
function addExtensionIfMissing(basename, extension) {
    if (typeof basename !== 'string' || typeof extension !== 'string') {
        throw new TypeError('Both basename and extension must be strings');
    }

    const trimmedBasename = basename.trim();
    const formattedExtension = extension.trim();
    const needsDot = formattedExtension && formattedExtension !== '.' && !formattedExtension.startsWith('.');
    const finalExtension = needsDot ? `.${formattedExtension}` : formattedExtension;

    if (trimmedBasename.endsWith('.')) {
        return trimmedBasename;
    }

    return trimmedBasename.endsWith(finalExtension) ? trimmedBasename : `${trimmedBasename}${finalExtension}`;
}

/**
 * Adds the specified extension to the basename if it is not already present.
 *
 * This function trims both the basename and extension, ensuring that the extension
 * starts with a dot. If the basename already ends with the extension, it is returned
 * unchanged. If the basename ends with a dot, it is returned as is.
 *
 * @param {string} basename - The base name to which the extension should be added.
 * @param {string} extension - The extension to add to the basename.
 * @throws {TypeError} Throws if either basename or extension is not a string.
 * @returns {string} The basename with the extension added if it was missing.
 *
 * @example
 * addExtensionIfMissing('file', 'txt'); // Returns 'file.txt'
 * addExtensionIfMissing('file.', 'txt'); // Returns 'file.'
 * addExtensionIfMissing('file.txt', 'txt'); // Returns 'file.txt'
 */
function buildCategory(item, { verbose, name, ...restOptions } = {}) {
    if (!Array.isArray(item.items)) {
        throw new Error('Items must be an array');
    }
    if (typeof item.label !== 'string') {
        throw new Error('Label must be a string');
    }
    sendMessage(verbose, name, 'info', `Building category ${item.label}`);

    let category = {
        label: item.label,
        type: 'category',
        items: buildItems(item.items, {
            ...restOptions,
            ...getItemAttr(item)
        })
    };

    if (item.generated_index) {
        category.link = {
            type: 'generated-index',
        };
        if (typeof item.brief === 'string' && item.brief.length > 0) {
            category.link.description = item.brief;
        }
    }

    return category;
}

/**
 * Maps over the items array and builds each item using the provided options.
 *
 * @param {Array} items - the array of items to be processed
 * @param {Object} options - the optional configuration options
 * @return {Array} the array of built items
 */
function buildItems(items, options = {}) {
    return items.map((item) => {
        if (item.html) {
            return { type: 'html', value: item.html };
        } else if (item.href) {
            return { type: 'link', label: item.label, href: item.href };
        } else if (item.items.length === 0) {
            return buildTopic(item, options);
        } else {
            const parentPath = path.join(slugifyPath(options.parentPath), slugifyPath(item.label));
            return buildCategory(item, {...options, parentPath});
            return buildCategory(item, options);
        }
    });
}

/**
 * Converts a string path into a slugified path without filename.
 *
 * @throws {TypeError} Throws if input is not a string.
 * @throws {Error} Throws if path contains potentially harmful characters.
 *
 * @param {string} s - the string path to be converted
 * @returns {string} the slugified path without filename
 * @example
 * slugifyPath('path/to/file'); // Returns 'path/to/file'
 * slugifyPath('path/to/directory/'); // Returns 'path/to/directory'
 */
function slugifyPath(s) {
    if (!s) return '';

    if (typeof s !== 'string') {
        throw new Error('Path must be a string');
    }

    const harmfulPatterns = ['..', '<', '>', ':', '"', '|', '?', '*'];
    if (harmfulPatterns.some(pattern => s.includes(pattern))) {
        throw new Error(`Invalid path: potentially harmful characters detected in input '${s}'`);
    }

    const pathSep = path.sep; // Gets the platform-specific path separator
    const items = s.trim().split(/[\\/]/).filter(Boolean); // Splits and filters out empty segments

    return items.reduce((result, item) => result.length > 0 ? `${result}/${item.trim()}` : item.trim(), '');
}

/**
 * Builds a topic using the provided item and options.
 *
 * @param {Object} item - The item to build the topic from.
 * @param {Object} options - (Optional) Additional options for building the topic.
 * @return {string} The label of the built topic.
 */
function buildTopic(item, options = {}) {
    if (!item) {
        throw new Error('Item must not be null or undefined');
    }

    const topicPathParts = [
        getPath(options),
        getPath(item),
        getSlugOrId(item)
    ].filter(e => (e));

    const topicPath = topicPathParts.join('/');
    createTopicDocument(item, topicPath, options);

    return topicPath;
}

/**
 * Creates a topic document using the provided item and topic basename, with the option to customize the behavior using the provided options.
 *
 * @param {Object} item - the item used to create the topic document
 * @param {string} topicBasename - the base name for the topic document
 * @param {Object} [options={}] - optional parameters to customize the behavior
 */
function createTopicDocument(item, topicBasename, options = {}) {
    const content = hbsr.render_template('topic', {
        title: (item.title || item.label).trim(),
        sidebar_label: item.label,
        slug: (item.slug || item.id || item.label).trim(),
        headingItems: buildHeadingItems(item.headings),
        ...item,
    });

    const filename = `${options.docs}/${topicBasename}.md`;
    saveDocument(filename, content);
    sendMessage(options.verbose, options.name, 'info', `Created topic document ${filename}`);
}

/**
 * Builds heading items based on the input items and level.
 *
 * @param {array} items - The array of items to build heading items from.
 * @param {number} [level=2] - The level of the heading items, defaults to 2 if not provided.
 * @return {string} The concatenated string of rendered heading items.
 */
function buildHeadingItems(items = [], level = 2) {
    if (items) {
        return items.map(item => {
            const headingPrefix = '#'.repeat(level);
            return hbsr.render_template('heading', {
                prefix: headingPrefix,
                label: item.label,
                headingItems: buildHeadingItems(item.items, level + 1),
                ...item
            });
        }).join('\n');
    }
}

/**
 * Retrieves and returns the attributes of the given item, excluding the 'label' and 'items' attributes.
 *
 * @param {Object} item - The item to retrieve attributes from
 * @return {Object} The attributes of the item, excluding 'label' and 'items'
 */
function getItemAttr(item) {
    const { label, items, ...attributes } = item;
    return attributes;
}

/**
 * Retrieves the slugged path for the given item.
 *
 * @param {Object} item - The item to retrieve the path for.
 * @return {string} The slugged path for the given item.
 */
function getPath(item = {}) {
    const { path = '' } = item;
    return getSluggedPath(path);
}

/**
 * Returns a slugged path based on the input string or array of strings.
 *
 * @param {string|string[]} pathInput - The input string or array of strings to be converted into a slugged path.
 * @return {string} The slugged path generated from the input.
 */
function getSluggedPath(pathInput) {
    if (typeof pathInput === 'string') {
        return getSluggedPath(pathInput.split('/'));
    }

    if (!Array.isArray(pathInput)) {
        throw new Error('Path must be a string or an array');
    }

    return pathInput
        .map(element => element.trim().toLowerCase().replace(/[^a-zA-Z0-9\-]+/g, '-'))
        .join('/');
}

/**
 * Returns a slugged string based on the item's slug, id, or label. If no slug, id, or label is present, returns an empty string.
 *
 * @param {Object} item - The item to retrieve the slug from.
 * @return {string} The slugged string generated from the item.
 * @throws {Error} Throws an error if the item is null or undefined.
 */
function getSlugOrId(item) {
    if (!item) {
        throw new Error('Item must not be null or undefined');
    }
    return getSluggedPath(item.slug || item.id || item.label || '');
}

/**
 * Normalizes the given item object by trimming label strings and recursively normalizing items and headings arrays.
 * @param {Object|string} item - The item to be normalized, either an object with label and items/heading properties, or a string representing the label.
 * @returns {Object} - The normalized item object.
 */
function normalizeItem(item) {
    // If item is empty, return undefined
    if (!item) {
        return;
    }

    // If item is a string, convert it to an object with a trimmed label and empty items array
    if (typeof item === 'string') {
        return normalizeItem({ label: item.trim(), items: [] });
    }

    // If item is not an object, throw an error
    if (typeof item !== 'object') {
        throw new Error('Item must be an object');
    }

    if (!Object.keys(item).includes('label')) {
        const assumedLabel = Object.keys(item)[0];
        if (!Array.isArray(item[assumedLabel])) {
            throw new Error('Item must have a label');
        }
        return normalizeItem({ label: assumedLabel, items: item[assumedLabel] });
    }

    if (typeof item.items !== 'undefined' && !Array.isArray(item.items)) {
        throw new Error('Items must be an array');
    }

    // Normalize the item object
    let normalizedItem = {
        ...item,
        label: item.label ? item.label.trim() : '',
        items: item.items ? item.items.map(normalizeItem) : [],
    };

    if (typeof item.headings != 'undefined' && !Array.isArray(item.headings)) {
        throw new Error('Headings must be an array');
    } else if (item.headings) {
        // Normalize the headings array
        normalizedItem.headings = item.headings.map(normalizeItem);
    }

    // Validate the normalized item object
    if (!normalizedItem.label) {
        throw new Error('Label must not be empty');
    }

    if (!Array.isArray(normalizedItem.items)) {
        throw new Error('Items must be an array');
    }

    if (item.headings && !Array.isArray(item.headings)) {
        throw new Error('Headings must be an array');
    }

    return normalizedItem;
}

/**
 * Retrieves filenames based on provided primary and fallback patterns.
 *
 * This function validates the input patterns and attempts to match files using the primary pattern(s).
 * If no files are matched with the primary pattern(s), it falls back to using the fallback pattern(s).
 *
 * @param {string|string[]} primaryPattern - The primary pattern(s) to match files against.
 * @param {string|string[]} fallbackPattern - The fallback pattern(s) to use if no files are matched with the primary pattern.
 * @returns {string[]} An array of filenames that match the provided patterns.
 *
 * @example
 * // Using a single primary pattern and a single fallback pattern
 * retrieveFilenames('*.js', '*.ts');
 *
 * @example
 * // Using multiple primary patterns and a single fallback pattern
 * retrieveFilenames(['*.js', '*.jsx'], '*.ts');
 *
 * @example
 * // Using a single primary pattern and multiple fallback patterns
 * retrieveFilenames('*.js', ['*.ts', '*.tsx']);
 *
 * @example
 * // Using multiple primary and fallback patterns
 * retrieveFilenames(['*.js', '*.jsx'], ['*.ts', '*.tsx']);
 */
function retrieveFilenames(primaryPattern, fallbackPattern) {
    validatePatterns(primaryPattern, 'Primary pattern');
    validatePatterns(fallbackPattern, 'Fallback pattern');

    const primaryPatterns = isArray(primaryPattern) ? primaryPattern : [primaryPattern];
    const fallbackPatterns = isArray(fallbackPattern) ? fallbackPattern : [fallbackPattern];

    const matchedFiles = retrieveFilesFromPatterns(primaryPatterns);

    if (matchedFiles.length > 0) {
        return matchedFiles;
    }

    return retrieveFilesFromPatterns(fallbackPatterns);
}

/**
 * Retrieves files matching the given glob patterns.
 *
 * @param {string[]} patterns - An array of glob patterns to match files against.
 * @returns {string[]} An array of file paths matching the provided patterns.
 * @throws {Error} Throws an error if file retrieval fails.
 */
function retrieveFilesFromPatterns(patterns) {
    try {
        return globSync(patterns.flatMap(pattern => pattern));
        // return patterns.flatMap(pattern => globSync(pattern));
    } catch (error) {
        throw new Error('Failed to retrieve files', { cause: error });
    }
}

/**
 * Sends a message if the send switch is on.
 *
 * @param {boolean} sendSwitch - a boolean indicating whether to send the message
 * @param {string} applicationName - the name of the application
 * @param {string} messageType - the type of the message
 * @param {string} messageText - the text of the message
 * @return {void}
 */
function sendMessage(sendSwitch, applicationName, messageType, messageText) {
    if (sendSwitch) {
        sendProgressMessage(applicationName, messageType, messageText);
    }
}

/**
 * Sends a progress message based on the provided application name, message type, and message text.
 *
 * @param {string} applicationName - The name of the application sending the message
 * @param {string} messageType - The type of the message (info, warning, error)
 * @param {string} messageText - The text content of the message
 */
function sendProgressMessage(applicationName, messageType, messageText) {
    switch (messageType) {
        case 'info':
            console.log(`\x1b[34m${applicationName} - INFO: ${messageText}\x1b[0m`);
            break;
        case 'warning':
            console.log(`\x1b[33m${applicationName} - WARNING: ${messageText}\x1b[0m`);
            break;
        case 'error':
            console.log(`\x1b[31m${applicationName} - ERROR: ${messageText}\x1b[0m`);
            break;
        default:
            console.log(`${applicationName} - ${messageType}: ${messageText}`);
    }
}

/**
 * Converts a string into a URL-friendly slug.
 *
 * @param {string} s - The input string to be converted.
 * @returns {string} - The slugified version of the input string.
 *
 * This function trims the input, converts it to lowercase, and replaces
 * non-alphanumeric characters (except hyphens and underscores) with hyphens.
 * It also collapses multiple hyphens into a single hyphen and removes
 * leading and trailing hyphens or underscores.
 */
function slug(s) {
    return s
        .toString()
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\-_]+/gi, '-') // Allow both hyphens and underscores
        .replace(/-+/g, '-') // Replace multiple hyphens with a single hyphen
        .replace(/^[-_]+|[-_]+$/g, ''); // Remove leading and trailing hyphens or underscores
}

/**
 * Validates the provided filenames against the given JSON schema.
 *
 * @param {string[]} filenames - List of filenames to validate
 * @param {object} jsonSchema - The JSON schema to validate against
 * @return {{valid: string[], invalid: string[]}} - An object with two properties: valid and invalid. The valid property contains an array of valid filenames, and the invalid property contains an array of invalid filenames.
 * @throws {Error} Throws an error if the validation fails
 * @throws {Error} Throws an error if filenames is not an array of strings
 * @throws {Error} Throws an error if jsonSchema is not an object
 *
 * @example
 * const filenames = ['docs/docs-category-1/category-1-topic-1.yml', 'docs/docs-category-2/category-2-topic-2.yml'];
 * const jsonSchema = {
 *     type: 'object',
 *     properties: {
 *         label: { type: 'string' },
 *         slug: { type: 'string' },
 *         items: { type: 'array' }
 *     },
 *     required: ['label', 'slug', 'items']
 * };
 * const { valid, invalid } = validateFiles(filenames, jsonSchema);
 */
function validateFiles(filenames, jsonSchema) {
    if (!Array.isArray(filenames)) {
        throw new Error('filenames is required and must be an array of strings');
    }

    if (jsonSchema === null || typeof jsonSchema !== 'object' || jsonSchema === undefined) {
        throw new Error('jsonSchema is required');
    }

    const { validate } = require('jsonschema');

    return filenames.reduce((result, filename) => {
        try {
            // Load the content of the file as YAML
            const fileContent = yamljs.load(filename);
            if (fileContent === null) {
                // The file is empty
                throw new Error(`File ${filename} is empty`);
            }

            // Validate the content against the JSON schema
            const r = validate(fileContent, jsonSchema);
            if (r.valid) {
                // The file is valid
                result.valid.push(filename);
            } else {
                // The file is invalid
                result.invalid.push({ filename, errors: r.errors });
            }
        } catch (error) {
            // There was an error loading or validating the file
            result.invalid.push({ filename, error });
        }

        return result;
    }, { valid: [], invalid: [] });
}

/**
 * Validates that a given pattern is not null or undefined.
 *
 * @param {any} pattern - The pattern to validate.
 * @param {string} patternName - The name of the pattern, used in the error message if validation fails.
 * @throws {Error} Throws an error if the pattern is not provided.
 */
function validatePatterns(pattern, patternName) {
    if (!pattern) {
        throw new Error(`${patternName} is required`);
    }
}

/**
 * Processes files based on provided options and patterns, validating them against a schema.
 *
 * @param {Object} options - Configuration options for processing.
 * @param {string} options.schema - Path to the schema file for validation.
 * @param {boolean} options.verbose - Flag to enable verbose logging.
 * @param {Array<string>} patterns - Patterns to match files for processing.
 * @param {Array<string>} fallbackPatterns - Fallback patterns if primary patterns fail.
 * @returns {Object} An object containing arrays of valid and invalid files.
 *
 */
function processFiles(options, patterns, fallbackPatterns) {
    const path = require('path');
    const fs = require('fs');
    const { schema, verbose } = options;
    let outlineSchema;
    let result;
    try {
        if (fs.existsSync(schema) && path.isAbsolute(schema)) {
            outlineSchema = require(schema);
        } else {
            throw new Error('Invalid schema path');
        }
        const files = retrieveFilenames(patterns, fallbackPatterns);
        result = validateFiles(files, outlineSchema);
        const duplicatedSidebarNames = checkDuplicatedSidebarNames(result.valid);
        if (Object.keys(duplicatedSidebarNames).length > 0) {
            result.duplicatedSidebarNames = duplicatedSidebarNames;
        }

    } catch (error) {
        sendMessage(true, 'skelosaurus', 'error', `Error processing files: ${error.message}`);
        return { valid: [], invalid: [] };
    }

    return result;
}


/**
 * Identifies and returns duplicated sidebar names from a list of filenames.
 *
 * @param {string[]} filenames - An array of filenames to check for duplicate sidebar names.
 * @returns {Object} An object where keys are duplicated sidebar names and values are arrays of filenames
 *                   associated with each duplicated name.
 */
function checkDuplicatedSidebarNames(filenames) {
    if (!filenames || filenames.length === 0) {
        return {};
    }
    const seenLabels = filenames.reduce(collectLabels, {});

    return Object.entries(seenLabels).reduce((duplicatedSidebarNames, [label, files]) => {
        if (files.length > 1) {
            duplicatedSidebarNames[label] = files;
        }
        return duplicatedSidebarNames;
    }, {});
}

/**
 * Collects labels from the sidebars of a YAML file and aggregates them into an accumulator object.
 *
 * @param {Object} acc - The accumulator object where labels are collected.
 * @param {string} filename - The path to the YAML file to be processed.
 * @returns {Object} The updated accumulator object with labels as keys and arrays of filenames as values.
 *
 * @throws Will log an error message if the file cannot be read or parsed.
 */
function collectLabels(acc, filename) {
    try {
        // Validate and sanitize the filename
        const safeFilename = path.normalize(filename).replace(/^(\.\.(\/|\\|$))+/, '');
        let fileContent = fs.readFileSync(safeFilename, 'utf8');
        let sidebars = yamljs.parse(fileContent).sidebars;
        if (Array.isArray(sidebars)) {
            sidebars.forEach(item => {
                const normalizedItem = normalizeItem(item);
                acc[normalizedItem.label] = acc[normalizedItem.label] || [];
                acc[normalizedItem.label].push(safeFilename);
            });
        }
    } catch (error) {
        console.error(`Error processing file ${filename}:`, error);

    }

    return acc;
}

/**
 * Checks and processes file patterns against provided options and fallback patterns.
 *
 * @param {Array} patterns - The primary patterns to be checked.
 * @param {Object} options - Configuration options for processing files.
 * @param {Array} fallbackPatterns - Alternative patterns used if primary patterns fail.
 * @throws Will throw an error if `patterns` or `fallbackPatterns` are not arrays,
 *         or if `options` is not an object.
 * @returns {Object} The result of the file processing, including invalid, valid,
 *                   and duplicated sidebar names.
 */
function checkPatterns(patterns, options, fallbackPatterns) {
    if (!Array.isArray(patterns) || !Array.isArray(fallbackPatterns)) {
        throw new Error('`patterns` and `fallbackPatterns` should be arrays.');
    }
    if (typeof options !== 'object' || options === null) {
        throw new Error('`options` should be an object.');
    }

    let result;
    try {
        result = processFiles(options, patterns, fallbackPatterns);
    } catch (error) {
        sendMessage(true, 'skelosaurus', 'error', `Error processing files: ${error.message}`);
        return;
    }
    const { invalid, valid, duplicatedSidebarNames } = result;

    if (invalid.length > 0) {
        sendMessage(true, 'skelosaurus', 'error', `Invalid files: ${JSON.stringify(invalid, null, 4)}`);
    }

    if (valid.length === 0) {
        sendMessage(options.verbose, 'skelosaurus', 'info', 'No valid files');
    } else {
        sendMessage(options.verbose, 'skelosaurus', 'info', `Valid filenames: ${JSON.stringify(valid, null, 4)}`);
        if (duplicatedSidebarNames) {
            sendMessage(true, 'skelosaurus', 'info', `Duplicated sidebar names: ${JSON.stringify(duplicatedSidebarNames, null, 4)}`);
        }
    }

    return result;
}

module.exports = {
    addExtensionIfMissing,
    buildCategory,
    buildHeadingItems,
    buildItems,
    buildTopic,
    checkDuplicatedSidebarNames,
    checkPatterns,
    createTopicDocument,
    getItemAttr,
    getPath,
    getSluggedPath,
    getSlugOrId,
    normalizeItem,
    processFiles,
    retrieveFilenames,
    sendMessage,
    sendProgressMessage,
    slug,
    slugifyPath,
    validateFiles,
    validatePatterns
}