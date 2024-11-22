#!/usr/bin/env node

const { Command } = require('commander')
const fs = require('fs');
const path = require('path');
const yamljs = require('yamljs');

const {
    findDuplicatedSidebars,
    getFilesFromPatterns,
    validateFiles,
    buildSidebar,
    getSidebars,
} = require('./lib/skelo-utils');

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
        try {
            const files = getFilesFromPatterns(patterns, options.fallbackPatterns);

            try {
                const { validFiles, invalidFiles } = validateFiles(files, options);
                const duplicatedSidebars = findDuplicatedSidebars(validFiles);
                const documentationSidebars = {};
                validFiles.forEach(file => {
                    const {sidebars, ...rest} = getSidebars(file);
                    sidebars.forEach(sidebar => {
                        if (!duplicatedSidebars[sidebar.label]) {
                            const sidebarItems = buildSidebar(sidebar.items, options);
                            documentationSidebars[sidebar.label] = sidebarItems;
                        }
                    });
                });
                
                try {
                    fs.writeFileSync(options.sidebars, `module.exports = ${JSON.stringify(documentationSidebars, null, 4)};`, 'utf-8');
                } catch (error) {
                    console.error(`Error writing sidebars file: ${error.message}`);
                }
            } catch (error) {
                console.error(`Error generating sidebars: ${error.message}`);
            }
        } catch (error) {
            console.error(`Error building sidebars: ${error}`);
        }
    })

program.configureHelp({
    sortOptions: true,
    sortSubcommands: true,
    helpWidth: 80,
    showGlobalOptions: true
})

program.parse("node index.js *.outline.yaml *.outline.yml".split(' '))
// program.parse()