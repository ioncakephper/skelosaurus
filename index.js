#!/usr/bin/env node

const colors = require('colors');
const program = require('commander')
const fileEasy = require('file-easy');
const fs = require('fs');
const hbsr = require('hbsr');
const md = require('markdown').markdown;
const path = require('path');
const FileSet = require('file-set');
const util = require('util');
const LoremIpsum = require("lorem-ipsum").LoremIpsum;


const lorem = new LoremIpsum();

hbsr.options.template_path = path.join(__dirname, 'templates');

let version = require(path.join(__dirname, 'package.json')).version;

let allUniqueNames = [];

program
    .passCommandToAction(false);

program
    .name('skelo')
    .description('Skeleton documentation generator for Docusaurus (v2 and v2)')
    .usage('[options] outlineFiles...')
    .version(version)

program
    .command('build <sources...>', { isDefault: true })
    .description('build doc files and sidebars file')

    .option('-c, --clear', 'start with a clear docs path')
    .option('-d, --docs <path>', 'path where markdown files are generated into', './docs')
    .option('-f, --autofolder', 'create subfolder for categories and subtopics', false)
    .option('-i, --intro', 'create in Intro page in each subcategory')
    .option('--introTitle [title]', 'title to use in intro pages', 'Overview')
    .option('--no-v2', 'generate for Docusaurus v1')
    .option('-o, --out <filename>', 'filename to contains sidebars', 'sidebars')
    .option('-p, --parts [path]', 'path where parts will be stored', './')
    .option('-w, --website <path>', 'path to store sidebars content file', './')

    .action((sources, opts) => {
        let allUniqueNames = [];

        if (!opts.v2) {
            opts.website = path.join(opts.website, 'website');
        }

        if (sources.length == 0) {
            program.help((helpText) => {
                return helpText + '\n' + colors.yellow('Provide at least one outline file.')
            })
        }
        let sb = {}
        let allSidebars = {};
        sources.forEach((sourceFilename) => {
            sourceFilename = fileEasy.setDefaultExtension(sourceFilename, '.md')
            let sidebars = getSidebars(sourceFilename)
            allSidebars = { ...allSidebars, ...sidebars }
        })

        let sortedSidebarNames = Object.keys(allSidebars).sort();
        if (sortedSidebarNames) {
            if (sortedSidebarNames.length > 0) {
                if (opts.clear) {

                    const deleteFolderRecursive = function (folder) {
                        if (fs.existsSync(folder)) {
                            fs.readdirSync(folder).forEach((file, index) => {
                                const curPath = path.join(folder, file);
                                if (fs.lstatSync(curPath).isDirectory()) { // recurse
                                    deleteFolderRecursive(curPath);
                                } else { // delete file
                                    fs.unlinkSync(curPath);
                                }
                            });
                            fs.rmdirSync(folder);
                        }
                    };

                    deleteFolderRecursive(opts.docs)
                }
                sortedSidebarNames.forEach((sidebarName) => {
                    sb[sidebarName] = buildSectionCategories(allSidebars[sidebarName], opts)
                })

            }
        }
        let content = JSON.stringify(sb, null, 4);
        if (opts.v2) {
            content = hbsr.render_template('sidebarsjs', { content: content });
        }

        let extension = (opts.v2) ? '.js' : '.json'
        let outFilename = fileEasy.setDefaultExtension(opts.out, extension)
        outFilename = path.join(opts.website, outFilename);
        saveDocument(outFilename, content)
        console.log('Sidebars file ' + colors.green(outFilename) + ' generated.');
    })

program
    .command('load')
    .description('load documentation parts into respective files')
    .option('-d, --docs <path>', 'path where markdown files are generated into', './docs')
    .option('-p, --parts [path]', 'path where parts will be stored', './')
    .option('-w, --website <path>', 'path to store sidebars content file', './')
    .action((opts) => {
        let fileSet = new FileSet([path.join(opts.docs, '**/*.md')])
        fileSet.files.forEach((sourceFile) => {
            loadDocumentParts(sourceFile, opts, true)
        })
    });

program
    .command('save')
    .description('save documentation parts into respective files')
    .option('-d, --docs <path>', 'path where markdown files are generated into', './docs')
    .option('-p, --parts [path]', 'path where parts will be stored', './')
    .option('-w, --website <path>', 'path to store sidebars content file', './')
    .action((opts) => {

        let fileSet = new FileSet([path.join(opts.docs, '**/*.md')])
        fileSet.files.forEach((sourceFile) => {
            saveDocumentParts(sourceFile, opts, true)
        })

    });

// program.parse()
program.parse('nodejs index.js sampleHeaders -w ./sample/sample-doc/ -d ./sample/sample-doc/docs -p ./sample/sample-doc-parts -i -c -f'.split(' '))

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
    let program = options['program'];
    bulletList.slice(1).forEach((topicItem) => {
        //
        // Does this topic have children
        //
        let parsed = parseTitle(topicItem[1]);
        if (isSingleTopic(topicItem)) {
            //
            // A single topic
            //
            let topicHeaders = (hasHeaders(topicItem)) ? getTopicHeaders(topicItem[2], program) : [];

            let unique = buildTopicPage(parsed.title, { 'parent': parent, headers: topicHeaders, 'prefix': options.prefix, 'description': parsed.description, 'id': parsed.slug, 'altTitle': parsed.altTitle, 'program': options['program'] })

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
                        'ids': buildCategoryTopics(topicItem[2], { 'parent': path.join(parent, parsed.slug), 'prefix': options.prefix, 'program': options['program'] })
                    })
                } else {
                    items.push({
                        'type': 'subcategory',
                        'label': title,
                        'ids': buildCategoryTopics(topicItem[2], { 'parent': path.join(parent), 'prefix': fileEasy.slug(title), 'program': options['program'] })
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
                        'items': buildCategoryTopics(topicItem[2], { 'parent': path.join(parent, parsed.slug), 'prefix': options.prefix, 'program': options['program'] })
                    })
                } else {
                    items.push({
                        'type': 'category',
                        'label': title,
                        'items': buildCategoryTopics(topicItem[2], { 'parent': path.join(parent), 'prefix': fileEasy.slug(title), 'program': options['program'] })
                    })
                }
            }
        }
    })

    if (program.intro > 0) {
        let unique = buildTopicPage(program.introTitle, { 'parent': parent, 'headers': [], 'prefix': options.prefix, 'program': options['program'] })
        let itemPath = slug(parent)
        itemPath = itemPath.replace(/\\/g, '/')

        itemPath = slug(path.join(itemPath, unique))
        itemPath = itemPath.replace(/\\/g, '/')

        items.unshift(itemPath)
    }
    return items;
}

/**
 * Build headers as template variables
 *
 * @param {Array} bulletlist Representation of list in Markdown abstract tree
 * @opts {object} Command line options passed as properties
 * @param {number} [level=2] Heading level for Markdown notation
 * @returns {Array} Array of objects where each object is a set of template variables
 */
function buildHeaders(bulletlist, opts, level = 2) {
    if (!bulletlist) {
        return []
    }
    let program = opts;
    let toc = bulletlist.slice(1).map((headerItem) => {
        if (util.isArray(headerItem)) {
            if (headerItem[0] == 'inlinecode') {
                headerItem = '`' + headerItem[1] + '`'
            }
        }
        let parsed = parseTitle(headerItem[1]);
        let parts = path.join(path.relative(program.docs, program.parts));
        if (util.isArray(headerItem[1])) {
            if (headerItem[1][0] == 'inlinecode') {
                headerItem[1] = '`' + headerItem[1][1] + '`'
            }
        }
        return {
            'title': parsed.title,
            'prefix': '#'.repeat(level),
            'level': level,
            'id': fileEasy.slug(headerItem[1]),
            'description': parsed.description || lorem.generateSentences(5),
            'parts': parts,
            'content': hbsr.render_template('sub-headers', { 'headers': buildHeaders(headerItem[2], opts, level + 1) })
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
function buildSectionCategories(bulletList, opts, options = { 'parent': './' }) {
    let topCategories = {}
    if (bulletList[0] == 'bulletlist') {
        bulletList.slice(1).forEach((category) => {
            let parsed = parseTitle(category[1]);
            let title = parsed.title;
            let isFolder = parsed.isFolder || program.autofolder;

            let parent = options.parent;
            if (isFolder) {
                parent = path.join(parent, parsed.slug)
                parent = parent.replace(/\\/g, '/')
            }
            topCategories[title] = buildCategoryTopics(category[2], { 'parent': parent, 'prefix': '', 'program': opts });
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

    let program = options['program'];
    let mdHeaders = options.headers;

    let id = getUniqueName(fileEasy.slug(options.id || title), options)

    let parts = path.join(path.relative(program.docs, program.parts)).replace(/\\/g, '/');

    let content = hbsr.render_template('doc-topic', {
        'title': options.altTitle || title,
        'id': id,
        'sidebar_label': title,
        'parts': parts,
        'description': options.description || lorem.generateSentences(5),
        'headers': mdHeaders
    })

    let topicFilename = id
    topicFilename = slug(path.join(program.docs, options.parent, topicFilename)).replace(/\\/g, '/');

    topicFilename = topicFilename + '.md';
    saveDocument(topicFilename, content)
    console.log('Topic file ' + colors.green(topicFilename) + ' generated.');
    saveDocumentParts(topicFilename, program);
    return path.basename(topicFilename, path.extname(topicFilename));
}

/**
 * Get document parts in specified file
 *
 * @param {string} sourceFile Path to documentation file
 @ @returns {Array.{targetPath: string, content: string}} Array of part object, each part has targetPath and content properties
 */
function getDocumentParts(sourceFile) {
    let source = fs.readFileSync(sourceFile, 'utf8');

    let regex = /\<\!\-\- *@part +src *= *"([^"]*)" *\-\-\>(\r\n[a-zA-Z0-9\,\.\(\)\s\-\_\+\*\&\^\%\$\#\@\!\}\]\|\\\{\[\"\:\;\?\/\>\<]*)*\r\n\s*<\!\-\- *@\/part *\-\-\>/gi

    let parts = []
    let allMatches = regex.exec(source);
    while (allMatches != null) {
        parts.push({
            matched: allMatches[0],
            targetPath: allMatches[1],
            content: allMatches[2]
        })
        allMatches = regex.exec(source);
    }
    return parts;
}

/**
 * Create parts files for a specified topic document
 *
 * @param {string} sourceFile Path to topic document
 * @param {object} program Options passed on command
 */
function saveDocumentParts(sourceFile, program, override = false) {
    getDocumentParts(sourceFile).forEach((part) => {
        let targetPath = part.targetPath;
        let partContent = part.content;
        let completePath = path.join(program.docs, targetPath);
        if (override || !fs.existsSync(completePath)) {
            saveDocument(completePath, partContent);
        }
    })
}

function loadDocumentParts(sourceFile, program) {
    let source = fs.readFileSync(sourceFile, 'utf8')
    getDocumentParts(sourceFile).forEach((part) => {
        let targetPath = part.targetPath;
        let partContent = part.content;
        let completePath = path.join(program.docs, targetPath);
        if (fs.existsSync(completePath)) {
            let partSource = fs.readFileSync(completePath, 'utf8')
            let newpart = hbsr.render_template('part', {
                src: targetPath,
                content: partSource
            })
            source = source.replace(part.matched, newpart);
        }
    })
    saveDocument(sourceFile, source)
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
 * Build topic top headers
 *
 * @param {Array} bulletlist Header list represented in Markdown abstrat tree
 * @param {object} Command line options passed as properties
 * @returns {Array} Headers in markdown notation
 */
function getTopicHeaders(bulletlist, opts) {
    let headers = []
    if (bulletlist[0] == 'bulletlist') {
        let firstItem = bulletlist[1];
        let hasHeaders = firstItem[1].match(/\@headers\s*/gi)
        if (hasHeaders) {
            headers = buildHeaders(firstItem[2], opts);
        }
    }
    return headers;
}

/**
 * Return a variant string
 *  
 * @param {string} name The name to check for uniqueness
 * @returns {string} Original string with suffixed text
 */
function getUniqueName(name, options = {'parent': './'}) {
    name = path.join(options.parent, name)
    if (allUniqueNames.includes(name)) {
        let base = (!name.match(/(\-[0-9]+)$/)) ? name : name.substr(0, name.lastIndexOf('-'));
        let newEntry = base + '-' + makeid(5);
        while (allUniqueNames.includes(newEntry)) {
            newEntry = base + '-' + makeid(5);
        }
        allUniqueNames.push(newEntry);
        return path.basename(newEntry);
    }
    allUniqueNames.push(name);
    return path.basename(name);
}

/**
 * Checks whether the topic has headers
 * 
 * @param {object} topicItem Topic to test whether it has headers
 * @returns {boolean} true if topic has headers, false otherwise.
 */
function hasHeaders(topicItem) {
    if (topicItem[2]) {
        if (topicItem[2][1][1].trim().match(/\@h(eaders)?/gi)) {
            return true;
        }
    }
    return false;
}

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
 * Extract topic title to extract relevant information
 * 
 * @param {object} topicTitle Topic title to parse.
 * @returns {object} Properties extracted from title
 */
function parseTitle(topicTitle) {

    if (util.isArray(topicTitle)) {
        if (topicTitle[0] == 'inlinecode') {
            topicTitle = topicTitle[1]
        }
    }
    let regex = /^([^@]*)\@/;
    let matches = topicTitle.match(regex);
    let title = ((matches) ? matches[1] : topicTitle).trim();

    regex = /\@t(itle)?([^@]*)/gi
    matches = regex.exec(topicTitle);
    let altTitle = (matches) ? matches[2].trim() : title;

    regex = /\@f(older)?/gi;
    matches = topicTitle.match(regex);
    let isFolder = (matches) ? true : false;

    regex = /\@b(rief)?([^@]*)/gi
    matches = regex.exec(topicTitle)
    let description = (matches) ? matches[2].trim() : undefined;

    regex = /\@s(lug)?([^@]*)/gi
    matches = regex.exec(topicTitle);
    let slg = (matches) ? matches[2].trim() : title;
    slg = slug(slg);

    return {
        title: title,
        isFolder: isFolder,
        description: description,
        slug: slg,
        altTitle: altTitle
    }
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
    source = source.trim().toLowerCase().replace(regex, '-').replace(/\-+/gi, '-')
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