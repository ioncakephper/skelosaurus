#!/usr/bin/env node

'use strict';

const { Command } = require('commander');
const {saveDocument} = require('file-easy');
const { globSync } = require('glob');
const hbsr = require('hbsr');
const yamljs = require('yamljs');
const {sendMessage, addExtensionIfMissing, normalizeItem, getItemAttr, buildItems} = require('./lib/skelo-utils');

let program = new Command();

let { name, version, description } = require('./package.json');
name = 'skelo';

program
    .name(name)
    .version(version)
    .description(description)

program
    .command('build', { isDefault: true })
    .description('build the project')
    .argument('[pattern...]', 'pattern to match outline files', ['**/*.[oO]utline.+(yml|yaml)', '__outlines__/**/*.+(yml|yaml)'])

    .option('--verbose', 'be verbose')
    .option('-d, --docs <path>', 'path where markdown files are generated into', './docs')
    .option('-s, --sidebars <filename>', 'filename to contains sidebars', 'sidebars')

    .action((pattern, options) => {

        let files = globSync(pattern);
        files = files.filter(f => {
            let doc = yamljs.load(f);
            let items = doc.sidebars;

            return items && items.every(s => typeof s === 'string' || typeof s === 'object')
        })

        sendMessage(options.verbose, name, 'info', `found ${files.length} outline files: ${JSON.stringify(files, null, 2)}`);

        let generatedSidebars = {}
        for (let file of files) {
            let definedSidebars = yamljs.load(file).sidebars;

            for (let definedSidebar of definedSidebars) {
                definedSidebar = normalizeItem(definedSidebar);

                let { label, items } = definedSidebar;
                let itemAttr = getItemAttr(definedSidebar);
                generatedSidebars[label] = buildItems(items, { ...options, ...itemAttr, ...{name} });
            }
  
        }

        // create sidebars structure file
        let sidebarsFilenameContent = hbsr.render_template('sidebars', {
            sidebars: JSON.stringify(generatedSidebars, null, 4)
        })
        let sidebarsFilename = addExtensionIfMissing(options.sidebars, '.js');
        saveDocument(sidebarsFilename, sidebarsFilenameContent);
        sendMessage(options.verbose, name, 'info', `${sidebarsFilename} file created`);

    }) 

program.parse()
