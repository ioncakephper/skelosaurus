const shelljs = require('shelljs');

describe('skelo', () => {

    test('should generate documentation using default options', () => {
        // shelljs.exec(`echo "sidebars: []" > default.outline.yml`);
        shelljs.exec('node index.js build default.outline.yml');
    }) 
})