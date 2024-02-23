const shelljs = require('shelljs');

describe('skelo app', () => {
    test('should generate files and folders', () => {
        expect(shelljs.exec('node index.js build __tests__/skelo-app/testOutline.yml -s test/website/sidebars.js -d test/website/docs').code).toBe(0);
    })  

    test('should generate files and folders with --verbose', () => {
        expect(shelljs.exec('node index.js build --verbose __tests__/skelo-app/testOutline.yml -s test/website/sidebars.js -d test/website/docs').code).toBe(0);
    })  
})