const assert = require('assert');
const shelljs = require('shelljs');

describe('skelo app', () => {
    test('should provide help with -h, --help or help subcommand', () => {
        expect(shelljs.exec('node index.js -h').code).toBe(0);
        expect(shelljs.exec('node index.js --help').code).toBe(0);
        expect(shelljs.exec('node index.js help').code).toBe(0);
    })

    test('should provide version with -V or --version', () => {
        expect(shelljs.exec('node index.js -h').code).toBe(0);
        expect(shelljs.exec('node index.js --help').code).toBe(0); 
    })

    test('should provide help for build subcommand', () => {
        expect(shelljs.exec('node index.js help build').code).toBe(0);
        expect(shelljs.exec('node index.js help b').code).toBe(0);
    })
})