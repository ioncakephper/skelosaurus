#!/usr/bin/env node

const { Command } = require('commander')
const path = require('path');
const fs = require('fs');
const yamljs = require('yamljs');

const {
    findDuplicatedSidebars,
    getFilesFromPatterns,
    normalizeItem,
    validateFiles,
} = require('./lib/skelo-utils');

// TODO: Update description property in package: refer to v2 and up of Docusaurus

const { name, description, version } = require('./package.json')
let program = new Command();

program
    .name(name)
    .version(version)
    .description(description)

program
    .command('build', { isDefault: true })
    .alias('b')
    .description('build documentation files')
    .argument('[patterns...]', 'outline file patterns')

    .option('-d, --docs <path>', 'path to folder of generated documentation files', './docs')
    .option('-s, --sidebars <filepath>', 'path and filename to generated sidebars layout', './sidebars.js')
    .option('--verbose', 'verbose output')
    .option('-t, --templates <path>', 'path to template files', path.join(__dirname, 'templates'))
    .option('--schema <filepath>', 'path and filename to schema file', path.join(__dirname, 'schemas', 'outline.schema.json'))
    .option('--fallback-patterns <patterns...>', 'fallback outline file patterns', ['**/*.[Oo]utline.(yaml|yml)', '__outlines__/**/*.(yaml|yml)'])

    .action((patterns, options) => {
        const files = getFilesFromPatterns(patterns, options.fallbackPatterns);
        const {validFiles, invalidFiles} = validateFiles(files, options);
        const duplicatedSidebars = findDuplicatedSidebars(validFiles);

        // validFiles.foreach(file => {
        //     let { sidebars, ...rest } = yamljs.load(file);
        //     const normalizedSidebars = sidebars.map(normalizeItem);
        //     const uniqueSidebars = normalizedSidebars.filter(sidebar => !duplicatedSidebars.includes(sidebar));

        //     // TODO: get each item if uniqueSidebars, and set documentationSidebars[sidebar.label] = buildSidebar(sidebar.items, {...options, parentPath: rest.path})

        //     // const documentationSidebars = uniqueSidebars.reduce((acc, sidebar) => {
        //     //     return {...acc, [sidebar.label]: buildSidebar(sidebar.items, {...options, parentPath: rest.path})};
        //     // }, {});
        // })
    })


program.configureHelp({
    sortOptions: true,
    sortSubcommands: true,
    helpWidth: 80,
    showGlobalOptions: true
})

program.parse("node index.js sample.outline.yaml".split(' '))
// program.parse()