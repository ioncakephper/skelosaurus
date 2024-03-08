const { isString, isObject, isArray, isEmpty, isUndefined, isNull } = require('lodash');
const hbsr = require('hbsr');
const { saveDocument } = require('file-easy');

/**
 * Adds an extension to a basename if the basename does not end with the extension.
 *
 * @param {string} basename - The base name to which the extension will be added.
 * @param {string} extension - The extension to be added, starting with a period (e.g. '.txt').
 * @return {string} The basename with the extension added if it was missing.
 */
function addExtensionIfMissing(basename, extension) {
    extension = extension.trim();
    basename = basename.trim();
    if (basename.endsWith('.')) {
        return basename;
    }
    if (!basename.endsWith(extension)) {
        return `${basename}${extension}`;
    }
    return basename;
}

/**
 * Builds a category object based on the given item and options.
 *
 * @param {object} item - The item to build the category from.
 * @param {object} [options={}] - The options to customize the category.
 * @return {object} The category object built from the item and options.
 */
function buildCategory(item, options = {}) {
    if (!item.items) {
        throw new Error('Items must not be null or undefined');
    }
    sendMessage(options.verbose, options.name, 'info', `Building category ${item.label}`);
    let result = {
        label: item.label,
        type: 'category',
        items: buildItems(item.items, {
            ...options,
            ...getItemAttr(item, options)
        })
    }
    if (item.generated_index === true) {
        result = {
            ...result,
            ...{
                link: {
                    type: 'generated-index',
                    description: item.brief
                }
            }
        }
    }
    return result;

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
 * @param {type} item - the item to build the topic from
 * @param {Object} options - (optional) additional options for building the topic
 * @return {string} the label of the built topic
 */
function buildTopic(item, options = {}) {
    if (!item) {
        throw new Error('Item must not be null or undefined');
    }
    let topicBasename = [getPath(options), getPath(item), getSlugOrId(item)].filter(e => e).join('/');
    createTopicDocument(item, topicBasename, options);
    return topicBasename;
}

/**
 * Creates a topic document using the provided item and topic basename, with the option to customize the behavior using the provided options.
 *
 * @param {Object} item - the item used to create the topic document
 * @param {string} topicBasename - the base name for the topic document
 * @param {Object} [options={}] - optional parameters to customize the behavior
 */
function createTopicDocument(item, topicBasename, options = {}) {

    let topicContent = hbsr.render_template('topic', {
        ...{
            title: (item.title || item.label).trim(),
            sidebar_label: item.label,
            slug: (item.slug || item.id || item.label).trim(),
            headingItems: buildHeadingItems(item.headings)
        },
        ...item,

    })
    
    let topicFilename = `${options.docs}/${topicBasename}.md`;
    saveDocument(topicFilename, topicContent);
    sendMessage(options.verbose, options.name, 'info', `Created topic document ${topicFilename}`);

}

/**
 * Builds heading items based on the input items and level.
 *
 * @param {array} items - The array of items to build heading items from.
 * @param {number} [level=2] - The level of the heading items, defaults to 2 if not provided.
 * @return {string} The concatenated string of rendered heading items.
 */
function buildHeadingItems(items, level = 2) {
    if (items) {
        return items.map((item) => {
            return hbsr.render_template('heading', {
                'prefix': '#'.repeat(level),
                'label': item.label,
                'headingItems': buildHeadingItems(item.items, level + 1),
                ...item
            })
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
    let itemAttr = {};
    for(let attr in item) {
        if(attr !== 'label' && attr !== 'items') {
            itemAttr[attr] = item[attr];
        }
    }
    return itemAttr;
}

/**
 * Retrieves the slugged path for the given item.
 *
 * @param {string} item - The item to retrieve the path for.
 * @return {string} The slugged path for the given item.
 */
function getPath(item) {
    return getSluggedPath(item.path || '');
}

/**
 * Returns a slugged path based on the input string or array of strings.
 *
 * @param {string|string[]} input - The input string or array of strings to be converted into a slugged path.
 * @return {string} The slugged path generated from the input.
 */
function getSluggedPath(input) {
    if (typeof input === 'string') {
        return getSluggedPath(input.split('/'));
    }
    if (!Array.isArray(input)) {
        throw new Error('Path must be a string or an array');
    }
    return input.map(element => element.trim().toLowerCase().replace(/[^a-zA-Z0-9\-]+/g, '-')).join('/')
}

/**
 * Returns the slug or ID of the given item.
 *
 * @param {object} item - The item to retrieve the slug or ID from
 * @return {string} The slug or ID of the item
 */
function getSlugOrId(item) {
    return getSluggedPath(item.slug || item.id || item.label);
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

    // If item has a string label property, trim the label and validate items and headings arrays
    if (typeof item.label === 'string') {
        item.label = item.label.trim();

        // If label is empty, throw an error
        if (item.label === '') {
            throw new Error('Label must not be empty');
        }

        item = {
            ...{
                items: []
            },
            ...item
        }

        if (!isArray(item.items)) {
            console.log(item.items)
            throw new Error('Items must be an array');
        }

        // If items property is an array, normalize each item in the array
        item.items = item.items.map(normalizeItem);

        if (item.headings) {
            if (!isArray(item.headings)) {
                throw new Error('Headings must be an array');
            }

            // If headings property is an array, normalize each heading in the array
            item.headings = item.headings.map(normalizeItem)
        }

        return item;
    }
    else {
        // If item is an object without a label property, extract the first key-value pair as label and items
        let label = Object.keys(item)[0];
        let items = item[label];
        return normalizeItem({ label, items });
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
    return s.trim().toLowerCase().replace(/[^a-zA-Z0-9\-]+/g, '-').replace(/\-+/g, '-');
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
    sendMessage,
    sendProgressMessage,
    slug,
}