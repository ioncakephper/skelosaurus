const colors = require('colors');
const program = require('commander')
const fileEasy = require('file-easy');
const fs = require('fs');
const hbsr = require('hbsr');
const md = require('markdown').markdown;
const path = require('path');
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

program.parse()

if (!program.v2) {
    program.website = path.join(program.website, 'website');
}

if (program.args.length == 0) {
    program.help((helpText) => {
        return helpText + '\n' + colors.yellow('Provide at least one outline file.')
    })
}
let sb = {}
program.args.forEach((sourceFilename) => {
    sourceFilename = fileEasy.setDefaultExtension(sourceFilename, '.md')
    let sidebars = getSidebars(sourceFilename)
    for (const sidebarName in sidebars) {
        sb[sidebarName] = buildSectionCategories(sidebars[sidebarName])
    }
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
 * Build list of topics and subcagories in a category.
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
        if (!topicItem[2]) {
            buildTopicPage(topicItem[1], { 'parent': parent, 'headers': [], 'prefix': options.prefix })
            let itemPath = slug(path.join(parent, topicItem[1]))
            itemPath = itemPath.replace(/\\/g, '/')
            items.push(itemPath)
        } else {
            if (topicItem[1].match(/.+\@h(\s+.*)?/g)) {
                let title = topicItem[1].substr(0, topicItem[1].indexOf('@h'));
                buildTopicPage(title, { 'parent': parent, 'headers': topicItem[2], 'prefix': options.prefix }) // and use title and subheaders inside the topic
                let itemPath = fileEasy.slug(path.join(parent, title))
                itemPath = itemPath.replace(/\\/g, '/')
                items.push(itemPath)
            } else {
                let title = topicItem[1];
                let isFolder = topicItem[1].match(/.+\@f(\s+.*)?/g)
                if (isFolder) {
                    title = title.substr(0, title.indexOf('@f')).trim()
                }
                if (!program.v2) {
                    //
                    // For Docusaurus v1
                    //
                    if (isFolder) {
                        items.push({
                            'type': 'subcategory',
                            'label': title,
                            'ids': buildCategoryTopics(topicItem[2], { 'parent': path.join(parent, fileEasy.slug(title)), 'prefix': options.prefix })
                        })
                    } else {
                        items.push({
                            'type': 'subcategory',
                            'label': title,
                            'ids': buildCategoryTopics(topicItem[2], { 'parent': path.join(parent), 'prefix': fileEasy.slug(title) })
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
                            'items': buildCategoryTopics(topicItem[2], { 'parent': path.join(parent, fileEasy.slug(title)), 'prefix': options.prefix })
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
        }
    })

    return items;
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
            let title = category[1];
            let isFolder = title.match(/.+\@f(\s+.*)?/g)
            let parent = options.parent;
            if (isFolder) {
                title = title.substr(0, title.indexOf('@f')).trim();
                parent = path.join(parent, title)
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
 */
function buildTopicPage(title, options = { 'headers': [], 'parent': './', 'prefix': '' }) {

    // let mdHeaders = [{'prefix': '##', 'title': 'Ficticious', 'items': []}]
    let mdHeaders = [];
    let content = hbsr.render_template('doc-topic', {
        'title': title,
        'id': fileEasy.slug(title),
        'sidebar_label': title,
        'description': lorem.generateSentences(5),
        'headers': mdHeaders
    })

    let topicFilename = fileEasy.slug(title) + '.md'
    topicFilename = path.join(program.docs, fileEasy.slug(options.parent), topicFilename);
    saveDocument(topicFilename, content)
    console.log('Topic file ' + colors.green(topicFilename) + ' generated.');
}

/**
 * Extract sidebar title and sidebar outline from a Markdown file.
 *
 * @param {*} sourceFilename Filename of a Markdown file with outline
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
 * Create a text file in utf-8 format from specified name and content
 *
 * @param {*} fileName Name of the file to create.
 * @param {*} content String to place in the file.
 */
function saveDocument(fileName, content) {
    let ext = path.extname(fileName);
    let basename = fileEasy.slug(path.basename(fileName, ext));

    let d = path.dirname(fileName);
    let outputFilename = path.join(d, basename + ext)

    fileEasy.saveDocument(outputFilename, content)
}

/**
 * Convert specified string nto a slug.
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