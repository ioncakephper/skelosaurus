#!/usr/bin/env node

'use strict';

const { Command } = require('commander');
const path = require('path');
const fs = require('fs');
const yamljs = require('yamljs');
const { normalizeItem } = require('./lib/skelo-utils');
const { checkPatterns } = require('./lib/skelo-utils');
const { buildItems } = require('./lib/skelo-utils');

const program = new Command();

const { name, description, version } = require('../skelosaurus/package.json');
const { validateFiles, processFiles, sendMessage } = require('./lib/skelo-utils');
const fallbackPatterns = [['**/*.[oO]utline.yaml'], ['__outlines__/**/*.yaml']];

program
    .name(name)
    .description(description)
    .version(version)

program
    .command('check')
    .alias('c')
    .description('check if files are valid')
    .argument('[patterns...]', 'Glob patterns to match files', [])
    .option('-s, --schema <path>', 'path to schema', path.join(__dirname, 'outline.schema.json'))
    .option('-v, --verbose', 'verbose output')
    .action((patterns, options) => {
        checkPatterns(patterns, options, fallbackPatterns);
    })

program
    .command('build', { isDefault: true })
    .alias('b')
    .description('build doc files and sidebars file')
    .argument('[patterns...]', 'Glob patterns to match files', [])

    .option('-d, --docs <path>', 'path where markdown files are generated into', './docs')
    .option('-s, --sidebars <filepath>', 'path where sidebars file is generated into', './sidebars.js')
    .option('-t, --templates <path>', 'path to templates', path.join(__dirname, 'templates'))
    .option('--schema <path>', 'path to schema', path.join(__dirname, 'outline.schema.json'))
    .option('-v, --verbose', 'verbose output')

    .action((patterns, options) => {

        const diagnostics = checkPatterns(patterns, options, fallbackPatterns);
        const duplicatedSidebarNames = diagnostics.duplicatedSidebarNames ? Object.keys(diagnostics.duplicatedSidebarNames).sort() : [];
        const validFiles = diagnostics.valid || [];

        if (duplicatedSidebarNames.length > 0) {
            sendMessage(true, 'skelosaurus', 'warning', `Duplicated sidebar names: ${duplicatedSidebarNames.join(', ')} will not be generated as it's already in files: ${JSON.stringify(Object.values(diagnostics.duplicatedSidebarNames).sort(), null, 4)}`);
        }
    
        const documentationSidebar = {};

        validFiles.forEach(file => {
            const yaml = yamljs.load(file);
            const { sidebars: items = [], ...rest } = yaml;
            const { path: parentPath } = rest;

            const normalizedItems = items
                .map(normalizeItem)
                .filter(sidebar => !duplicatedSidebarNames.includes(sidebar.label));

                console.log("🚀 ~ .action ~ parentPath:", parentPath)
            normalizedItems.forEach(sidebar => {
                documentationSidebar[sidebar.label] = buildItems(sidebar.items, {
                    ...options,
                    parentPath
                });
            });
        }); 
            

        console.log("🚀 ~ .action ~ documentationSidebar:", documentationSidebar)


    })

program.parse("node index.js build --verbose".split(" "));
// program.parse("node index.js check sample.outline.yaml sa*.outline.yaml".split(" "));
// program.parse();


