const { isArray } = require('lodash');
const hbsr = require('hbsr');
const { saveDocument } = require('file-easy');
const { globSync } = require('glob');
const yamljs = require('yamljs');

/**
 * Adds an extension to a basename if the basename does not end with the extension.
 *
 * @param {string} basename - The base name to which the extension will be added.
 * @param {string} extension - The extension to be added, starting with a period (e.g. '.txt').
 * @return {string} The basename with the extension added if it was missing.
 */
function addExtensionIfMissing(basename, extension) {
    const trimmedBasename = basename.trim();
    const trimmedExtension = extension.trim();

    if (trimmedBasename.endsWith('.')) {
        return trimmedBasename;
    }

    if (!trimmedBasename.endsWith(trimmedExtension)) {
        return `${trimmedBasename}${trimmedExtension}`;
    }

    return trimmedBasename;
}

/**
 * Builds a category object based on the given item and options.
 *
 * @param {object} item - The item to build the category from.
 * @param {object} [options={}] - The options to customize the category.
 * @return {object} The category object built from the item and options.
 */
function buildCategory(item, { verbose, name, ...restOptions } = {}) {
    if (!Array.isArray(item.items)) {
        throw new Error('Items must be an array');
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
        let isHtml = item.items.length === 0 && typeof item.html === 'string';
        if (isHtml) {
            return {
                type: 'html',
                value: item.html,
            }
        }
        let isLink = item.items.length === 0 && typeof item.href === 'string';
        if (isLink) {
            return {
                type: 'link',
                label: item.label,
                href: item.href
            }
        }
        let isTopic = item.items.length === 0;
        return (isTopic ? buildTopic(item, options) : buildCategory(item, options));
    })
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
 * Retrieve matched files using the specified primary pattern.
 * If the primary pattern matches no files, use the fallback pattern.
 *
 * @param {string|string[]} primaryPattern The primary glob pattern to use.
 * @param {string|string[]} fallbackPattern The fallback glob pattern to use if the primary pattern matches no files.
 * @returns {string[]} The matched files.
 * @throws {Error} If either the primary or fallback pattern is not provided.
 * @throws {Error} If the primary or fallback pattern is not a string or an array of strings.
 *
 * @example
 * const matchedFiles = retrieveFilenames('*.js', '*.ts');
 * // matchedFiles is an array of matched files using the primary pattern
 *
 * @example
 * const matchedFiles = retrieveFilenames('non-existent-pattern', '*.js');
 * // matchedFiles is an array of matched files using the fallback pattern
 *
 * @example
 * const matchedFiles = retrieveFilenames(['*.js', '*.ts'], '*.ts');
 * // matchedFiles is an array of matched files using the primary pattern
 *
 * @example
 * const matchedFiles = retrieveFilenames(['non-existent-pattern', '*.js'], '*.ts');
 * // matchedFiles is an array of matched files using the fallback pattern
 *
 * @example
 * const matchedFiles = retrieveFilenames('*.js', ['non-existent-pattern', '*.ts']);
 * // matchedFiles is an array of matched files using the fallback pattern
 *
 * @example
 * const matchedFiles = retrieveFilenames(['*.js', '*.ts'], ['non-existent-pattern', '*.ts']);
 * // matchedFiles is an array of matched files using the fallback pattern
 */
function retrieveFilenames(primaryPattern, fallbackPattern) {
    if (!primaryPattern) {
        throw new Error('Primary pattern is required');
    }

    if (!fallbackPattern) {
        throw new Error('Fallback pattern is required');
    }

    const primaryPatterns = isArray(primaryPattern) ? primaryPattern : [primaryPattern];
    const fallbackPatterns = isArray(fallbackPattern) ? fallbackPattern : [fallbackPattern];

    let matchedFiles = retrieveFilesFromPatterns(primaryPatterns);

    if (matchedFiles.length === 0) {
        matchedFiles = retrieveFilesFromPatterns(fallbackPatterns);
    }

    return matchedFiles;
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
        return patterns.flatMap(pattern => globSync(pattern));
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
 * Generates a slug from the input string by removing special characters, trimming white spaces, and converting to lowercase.
 *
 * @param {string} s - the input string
 * @return {string} the generated slug
 */
function slug(s) {
    return s.toString().trim().toLowerCase().replace(/[^a-zA-Z0-9\-]+/g, '-').replace(/\-+/g, '-').replace(/^(-)|(-)$|^(-)$|(-)$/g, '');
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
            const fileContent = yamljs.load(filename);
            if (fileContent === null) {
                throw new Error(`File ${filename} is empty`);
            }

            const r = validate(fileContent, jsonSchema);
            if (r.valid) {
                result.valid.push(filename);
            }
            else {
                result.invalid.push(filename);
            }
        } catch (error) {
            result.invalid.push(filename);
        }

        return result;
    }, { valid: [], invalid: [] });
}


module.exports = {
    addExtensionIfMissing,
    buildCategory,
    buildHeadingItems,
    buildItems,
    buildTopic,
    createTopicDocument,
    getItemAttr,
    getPath,
    getSluggedPath,
    getSlugOrId,
    normalizeItem,
    retrieveFilenames,
    sendMessage,
    sendProgressMessage,
    slug,
    validateFiles
}