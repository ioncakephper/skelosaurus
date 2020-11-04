#!/usr/bin/env node

const colors = require('colors');
const { description } = require('commander');
const program = require('commander')
const fileEasy = require('file-easy');
const fs = require('fs');
const hbsr = require('hbsr');
const md = require('markdown').markdown;
const path = require('path');
const { title } = require('process');
const LoremIpsum = require("lorem-ipsum").LoremIpsum;

const lorem = new LoremIpsum();
hbsr.options.template_path = path.join(__dirname, 'templates');

let version = require(path.join(__dirname, 'package.json')).version;
program
    .name('skelo')
    .description('Skeleton documentation generator for Docusaurus (v2 and v2)')
    .usage('[options] outlineFiles...')
    .version(version)

program
    .option('-o, --out <filename>', 'filename to contains sidebars', 'sidebars')
    .option('-w, --website <path>', 'path to store sidebars content file', './')
    .option('-d, --docs <path>', 'path where markdown files are generated into', './docs')
    .option('--no-v2', 'generate for Docusaurus v1')
    .option('-f, --autofolder', 'create subfolder for categories and subtopics', false)
    .option('-i, --intro', 'create in Intro page in each subcategory')
    .option('--introTitle [title]', 'title to use in intro pages', 'Overview')

// program.parse('node index.js sampleHeaders -f -w ./ -d ./docs'.split(/ +/g));
program.parse()

let allUniqueNames = [];

if (!program.v2) {
    program.website = path.join(program.website, 'website');
}

if (program.args.length == 0) {
    program.help((helpText) => {
        return helpText + '\n' + colors.yellow('Provide at least one outline file.')
    })
}
let sb = {}
let allSidebars = {};
program.args.forEach((sourceFilename) => {
    sourceFilename = fileEasy.setDefaultExtension(sourceFilename, '.md')
    let sidebars = getSidebars(sourceFilename)
    allSidebars = { ...allSidebars, ...sidebars }
})

let sortedSidebarNames = Object.keys(allSidebars).sort();
sortedSidebarNames.forEach((sidebarName) => {
    sb[sidebarName] = buildSectionCategories(allSidebars[sidebarName])
})

let content = JSON.stringify(sb, null, 4);
if (program.v2) {
    content = 'module.exports = ' + content;
}

let extension = (program.v2) ? '.js' : '.json'
let outFilename = fileEasy.setDefaultExtension(program.out, extension)
outFilename = path.join(program.website, outFilename);
saveDocument(outFilename, content)
console.log('Sidebars file ' + colors.green(outFilename) + ' generated.');

/**
 * Checks whether a topic has children topics
 * 
 * @param {object} topicItem Topic to test whether it is single topic
 * @returns {boolean} true if single topic, false otherwise
 */
function isSingleTopic(topicItem) {
    return (!topicItem[2] || hasHeaders(topicItem))
}

/**
 * Checks whether the topic has headers
 * 
 * @param {object} topicItem Topic to test whether it has headers
 * @returns {boolean} true if topic has headers, false otherwise.
 */
function hasHeaders(topicItem) {
    if (topicItem[2]) {
        if (topicItem[2][1][1].trim().match(/\@headers/gi)) {
            return true;
        }
    }
    return false;
}

/**
 * Extract topic title to extract relevant information
 * 
 * @param {object} topicTitle Topic title to parse.
 * @returns {object} Properties extracted from title
 */
function parseTitle(topicTitle) {
    let regex = /^(.*)\@/;
    let matches = topicTitle.match(regex);
    let title = ((matches) ? matches[1] : topicTitle).trim();
    regex = /\@f/gi;
    matches = topicTitle.match(regex);
    let isFolder = (matches) ? true : false;

    regex = /\@brief(.*)/gi
    matches = topicTitle.match(regex);
    let description = (matches) ? topicTitle.substr(topicTitle.toLowerCase().indexOf('@brief') + 6).trim() : undefined;

    regex = /\@slug(.*)/gi
    matches = topicTitle.match(regex);
    let slg = (matches) ? topicTitle.substr(topicTitle.toLowerCase().indexOf('@slug') + 5).trim() : title;
    slg = slug(slg);

    return {
        title: title,
        isFolder: isFolder,
        description: description,
        slug: slg,
    }
}

/**
 * Build list of topics and subcategories in a category.
 *
 * @param {Array} bulletList The bullet list internal representation.
 * @param {object} [options={ 'parent': './', 'prefix': '' }] Options for building topic slug and folders
 * @returns {Array.Object} List of topics and categories.
 */
function buildCategoryTopics(bulletList, options = { 'parent': './', 'prefix': '' }) {
    if (!bulletList) {
        return []
    }
    let items = []
    let parent = options.parent;
    bulletList.slice(1).forEach((topicItem) => {
        //
        // Does this topic have children
        //
        let parsed = parseTitle(topicItem[1]);
        if (isSingleTopic(topicItem)) {

            //
            // A single topic
            //

            let topicHeaders = (hasHeaders(topicItem)) ? getTopicHeaders(topicItem[2]) : [];
            let unique = buildTopicPage(parsed.title, { 'parent': parent, headers: topicHeaders, 'prefix': options.prefix, 'description': parsed.description, 'id': parsed.slug })
            let itemPath = slug(path.join(parent, unique))
            itemPath = itemPath.replace(/\\/g, '/')
            items.push(itemPath)
        } else {
            ///
            /// Do we want to generate a subfolder for this topic?
            ///
            let title = parsed.title;
            let isFolder = parsed.isFolder || program.autofolder;
            if (!program.v2) {
                //
                // For Docusaurus v1
                //
                if (isFolder) {
                    items.push({
                        'type': 'subcategory',
                        'label': title,
                        'ids': buildCategoryTopics(topicItem[2], { 'parent': path.join(parent, parsed.slug), 'prefix': options.prefix })
                    })
                } else {
                    items.push({
                        'type': 'subcategory',
                        'label': title,
                        'ids': buildCategoryTopics(topicItem[2], { 'parent': path.join(parent), 'prefix': fileEasy.slug(title)})
                    })
                }
            } else {
                //
                // For Docusaurus v2
                //
                if (isFolder) {
                    items.push({
                        'type': 'category',
                        'label': title,
                        'items': buildCategoryTopics(topicItem[2], { 'parent': path.join(parent, parsed.slug), 'prefix': options.prefix })
                    })
                } else {
                    items.push({
                        'type': 'category',
                        'label': title,
                        'items': buildCategoryTopics(topicItem[2], { 'parent': path.join(parent), 'prefix': fileEasy.slug(title) })
                    })
                }
            }
        }
    })

    if (program.intro > 0) {
        let unique = buildTopicPage(program.introTitle, { 'parent': parent, 'headers': [], 'prefix': options.prefix })
        let itemPath = slug(path.join(parent, unique))
        itemPath = itemPath.replace(/\\/g, '/')
        items.unshift(itemPath)
    }
    return items;
}

/**
 * Build topic top headers
 *
 * @param {Array} bulletlist Header list represented in Markdown abstrat tree
 * @returns {Array} Headers in markdown notation
 */
function getTopicHeaders(bulletlist) {
    let headers = []
    if (bulletlist[0] == 'bulletlist') {
        let firstItem = bulletlist[1];
        let hasHeaders = firstItem[1].match(/\@headers\s*/gi)
        if (hasHeaders) {
            headers = buildHeaders(firstItem[2]);
        }
    }
    return headers;
}

/**
 * Build headers as template variables
 *
 * @param {Array} bulletlist Representation of list in Markdown abstract tree
 * @param {number} [level=2] Heading level for Markdown notation
 * @returns {Array} Array of objects where each object is a set of template variables
 */
function buildHeaders(bulletlist, level = 2) {
    if (!bulletlist) {
        return []
    }
    let toc = bulletlist.slice(1).map((headerItem) => {
        let parsed = parseTitle(headerItem[1]);
        return {
            'title': parsed.title,
            'prefix': '#'.repeat(level),
            'level': level,
            'id': fileEasy.slug(headerItem[1]),
            'description': parsed.description || lorem.generateSentences(5),
            'content': hbsr.render_template('sub-headers', { 'headers': buildHeaders(headerItem[2], level + 1) })
        }
    })
    return toc;
}

/**
 * Build items of navigation section.
 *
 * @param {Array} bulletList The bullet list internal representation.
 * @param {object} [options={ 'parent': './' }] Options for building section slug
 * @returns {object} Key-value where key is category title and value is a list of items or subcategories.
 */
function buildSectionCategories(bulletList, options = { 'parent': './' }) {
    let topCategories = {}
    if (bulletList[0] == 'bulletlist') {
        bulletList.slice(1).forEach((category) => {
            let parsed = parseTitle(category[1]);
            let title = parsed.title;
            let isFolder = parsed.isFolder || program.autofolder;

            let parent = options.parent;
            if (isFolder) {
                // if (!program.autofolder) {
                //     title = title.substr(0, title.indexOf('@f')).trim();
                // }
                parent = path.join(parent, parsed.slug)
                parent = parent.replace(/\\/g, '/')
            }
            topCategories[title] = buildCategoryTopics(category[2], { 'parent': parent, 'prefix': '' });
        })
    }
    return topCategories;
}

/**
 * Create topic documentation topic in Markdown.
 *
 * @param {string} title Topic title
 * @param {object} [options={ 'headers': [], 'parent': './', 'prefix': '' }] Options for creating topic file.
 * @returns {string} Topic unique slug
 */
function buildTopicPage(title, options = { 'headers': [], 'parent': './', 'prefix': '' }) {

    // let mdHeaders = [{'prefix': '##', 'title': 'Ficticious', 'items': []}]
    // let mdHeaders = []
    let mdHeaders = options.headers;
    let id = getUniqueName(fileEasy.slug(title))
    let content = hbsr.render_template('doc-topic', {
        'title': title,
        'id': id,
        'sidebar_label': title,
        'description': options.description || lorem.generateSentences(5),
        'headers': mdHeaders
    })

    let topicFilename = id
    topicFilename = path.join(program.docs, fileEasy.slug(options.parent), topicFilename);
    // topicFilename = getUniqueName(topicFilename);
    topicFilename = topicFilename + '.md';
    saveDocument(topicFilename, content)
    console.log('Topic file ' + colors.green(topicFilename) + ' generated.');
    return path.basename(topicFilename, path.extname(topicFilename));
}

/**
 * Extract sidebar title and sidebar outline from a Markdown file.
 *
 * @param {string} sourceFilename Filename of a Markdown file with outline
 * @returns {object} Key-value where key is the sidebar title and value is bullet list tree.
 */
function getSidebars(sourceFilename) {
    let tree = md.parse(fs.readFileSync(sourceFilename, 'utf8'));

    let sidebars = {}
    if (tree[0] === 'markdown') {
        let definition = {}
        for (let i = 1; i < tree.length - 1; i++) {
            let p1 = tree[i];
            let p2 = tree[i + 1];
            if (p1[0] == "header" && p1[1]['level'] == 2 && p2[0] == 'bulletlist') {
                sidebars[p1[2]] = p2;
            }
        }
    }

    return sidebars;
}

/**
 * Return a random string with digital characters of specified length
 *
 * @param {number} length The length of string to return.
 * @returns {string} Randomly chosen characters of specified length
 */
function makeid(length) {
    var result = '';
    var characters = '0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

/**
 * Return a variant string
 *  
 * @param {string} name The name to check for uniqueness
 * @returns {string} Original string with suffixed text
 */
function getUniqueName(name) {
    if (allUniqueNames.includes(name)) {
        let base = (!name.match(/(\-[0-9]+)$/)) ? name : name.substr(0, name.lastIndexOf('-'));
        let newEntry = base + '-' + makeid(5);
        while (allUniqueNames.includes(newEntry)) {
            newEntry = base + '-' + makeid(5);
        }
        allUniqueNames.push(newEntry);
        return newEntry;
    }
    allUniqueNames.push(name);
    return name;
}

/**
 * Create a text file in utf-8 format from specified name and content
 *
 * @param {string} fileName Name of the file to create.
 * @param {string} content String to place in the file.
 */
function saveDocument(fileName, content) {
    let ext = path.extname(fileName);
    let basename = fileEasy.slug(path.basename(fileName, ext));

    let d = path.dirname(fileName);
    let outputFilename = path.join(d, basename + ext)

    fileEasy.saveDocument(outputFilename, content)
}

/**
 * Convert specified string into a slug.
 * 
 * Converts spaces, tabs, and visible special characters into dashes (-) -- except backslash (\).
 * Compresses sequence of dashes or special characters into a single dash. Removes heading or trailing
 * dashes or special characters from the specified string.
 *
 * @param {string} source String to covert to slug.
 * @returns {string} Trimmed, lowercase string with dashes(-)
 */
function slug(source) {
    let regex = /[^a-zA-Z0-9\\]+/g
    source = source.trim().toLowerCase().replace(regex, '-')
    source = source.replace(/^\-+/g, '').replace(/\-+$/g, '')
    return source;
}

module.exports = {
    'buildCategoryTopics': buildCategoryTopics,
    'buildSectionCategories': buildSectionCategories,
    'buildTopicPage': buildTopicPage,
    'getSidebars': getSidebars,
    'saveDocument': saveDocument,
    'slug': slug,
}