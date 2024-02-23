const shelljs = require('shelljs');

describe('skelo', () => {
    // test('should print help', () => {
    //     shelljs.exec('node index.js --help');
    // })

    // test('should print version', () => {
    //     shelljs.exec('node index.js --version');
    // })

    // test('should print help', () => {
    //     shelljs.exec('node index.js help');
    // })

    // test('should print help for build', () => {
    //     shelljs.exec('node index.js help build');
    // })

    test('should generate documentation using default options', () => {
        // shelljs.exec(`echo "sidebars: []" > default.outline.yml`);
        shelljs.exec('node index.js build default.outline.yml');
    }) 
})