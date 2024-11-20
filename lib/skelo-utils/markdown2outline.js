const cheerio = require('cheerio')
const {marked} = require('marked')
const fs = require('fs');
const path = require('path');


/**
 * Converts a markdown string into an outline object containing sidebars.
 *
 * This function parses the provided markdown text to generate an HTML
 * representation using the `marked` library. It then loads the HTML
 * using `cheerio` to extract headers and create a structured outline
 * with sidebar items. In case of errors during parsing or loading,
 * an empty outline is returned.
 *
 * @param {string} markdownText - The markdown text to be converted.
 * @returns {Object} An outline object with a `sidebars` array containing parsed headers.
 */
function md2outline(markdownText) {
    const outline = { sidebars: [] };
    let md;
    try {
        md = marked(markdownText);
    } catch (error) {
        console.error("Error parsing markdown:", error);
        return outline; // or handle the error as needed
    }
    let $;
    try {
        $ = cheerio.load(md);
    } catch (error) {
        console.error("Error loading HTML:", error);
        return outline; // or handle the error as needed
    }

    $('h2').each(function() {
        const sidebarItem = parseHeader($(this), $);
        outline.sidebars.push(sidebarItem);
    });

    return outline;
}


/**
 * Parses an H2 header element to extract its text and associated content.
 *
 * @param {Object} h2 - The H2 header element to parse.
 * @param {Object} $ - The Cheerio instance for DOM manipulation.
 * @returns {Object} An object containing the header's label, brief description, and list items.
 */
function parseHeader(h2, $) {
    const sidebarItem = {};
    let t;
    sidebarItem.label = h2.text();
    t = parseParagraphs(h2, $);
    if (t && t.trim().length > 0) sidebarItem.brief = t
    t= parseLists(h2, $);
    if (t && t.length > 0) sidebarItem.items = t;
    return sidebarItem;
}

/**
 * Extracts and concatenates text from paragraph elements following a given h2 element.
 *
 * @param {Object} h2 - The h2 element from which to start searching for paragraphs.
 * @param {Object} $ - The cheerio instance used for DOM manipulation.
 * @returns {string} A string containing the concatenated text of all paragraph elements
 *                   found between the specified h2 and the next unordered list (ul),
 *                   separated by newlines. Returns an empty string if no paragraphs are found.
 */
function parseParagraphs(h2, $) {
    const ps = h2.nextUntil('ul').filter('p');
    return ps.length ? ps.map(function() { return $(this).text(); }).get().join('\n') : '';
}


/**
 * Parses a list of items from the HTML structure following a given <h2> element.
 *
 * This function searches for the first <ul> element that follows the specified <h2> element
 * and iterates over its <li> children. It extracts text from each <li> and checks for nested
 * <ul> elements. If a nested <ul> is found, it collects its <li> items as sub-items.
 * Additionally, it matches text patterns to extract key-value pairs or plain text items.
 *
 * @param {Object} h2 - The <h2> element to start searching from.
 * @param {Object} $ - The Cheerio instance for DOM manipulation.
 * @returns {Array} An array of parsed items, each item can be a string, an object with a key-value pair, 
 *                  or an object with a label and nested items.
 */
function parseLists(h2, $) {
    const items = [];
    const ul = h2.nextAll('ul').first();
    if (ul.length) {
        ul.find('li').each(function() {
            const li = $(this);
            const text = li.text();
            const childrenUl = li.children('ul');
            if (text && childrenUl.length) {
                const item = {
                    label: text,
                    items: childrenUl.find('li').map(function() { return $(this).text(); }).get()
                };
                items.push(item);
            } else {
                const match = text.match(/^\@\s*(\w+)\s*(.*)\n*$/);
                if (match) {
                    items.push({ [match[1]]: match[2] });
                } else {
                    const m = text.match(/^\s*(.*)\n*$/);
                    if (m) {
                        items.push(m[1]);
                    }
                }
            }
        });
    }
    return items;
}

/**
 * Converts a markdown file to an outline and saves it as a YAML file.
 *
 * @param {string} sourceMarkdownFilename - The filename of the markdown content.
 * @param {string} [targetYamlFilename] - Optional filename for the YAML content. If not provided, the markdown filename is used with a .yaml extension.
 */
function markdownToYaml(sourceMarkdownFilename, targetYamlFilename) {
    if (!sourceMarkdownFilename) {
        throw new TypeError('sourceMarkdownFilename is required');
    }

    if (typeof sourceMarkdownFilename !== 'string') {
        throw new TypeError('sourceMarkdownFilename must be a string');
    }
    if (sourceMarkdownFilename.trim().length === 0) {
        throw new TypeError('sourceMarkdownFilename must not be empty');    
    }

    if (!/\.(md|markdown)$/.test(sourceMarkdownFilename)) {
        sourceMarkdownFilename += '.md';
    }

    if (!targetYamlFilename) {
        try {
            const baseName = path.basename(sourceMarkdownFilename, path.extname(sourceMarkdownFilename));
            targetYamlFilename = baseName + '.yaml';
        } catch (error) {
            throw new Error('Error processing file paths: ' + error.message);
        }
    }
    if (/(\.\.[\/\\])/.test(targetYamlFilename)) {
        throw new Error('Invalid targetYamlFilename: path traversal detected');
    }
    if (!/\.(yaml|yml)$/.test(targetYamlFilename)) {
        targetYamlFilename += '.yaml';
    }

    try {
        const data = fs.readFileSync(sourceMarkdownFilename, 'utf8');
        const md2outline = require('skelo-utils/markdown2outline');
        if (typeof md2outline !== 'function') {
            throw new Error('md2outline is not a valid function');
        }
        const outline = md2outline(data);
        const yamlContent = yamljs.stringify(outline, 2, 4);

        fs.writeFileSync(targetYamlFilename, yamlContent, 'utf8');
    } catch (error) {
        console.error('An error occurred during file processing:', error);
    }
}

module.exports = {
    md2outline,
    markdownToYaml
}