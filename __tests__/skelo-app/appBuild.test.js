const shelljs = require('shelljs');

describe('skelo app: build', () => {

    // beforeEach(() => {
    //     shelljs.rm('-rf', 'test');
    // })

    // afterAll(() => {
    //     shelljs.rm('-rf', 'test');
    // })

    test('should generate files and folders', () => {
        expect(shelljs.exec('node index.js build __tests__/skelo-app/testOutline.yml -s test/website/sidebars.js -d test/website/docs').code).toBe(0);
    })  

    test('should generate files and folders with --verbose', () => {
        expect(shelljs.exec('node index.js build --verbose __tests__/skelo-app/testOutline.yml -s test/website/sidebars.js -d test/website/docs').code).toBe(0);
    })

    test('should generate a link item when topic has href property', () => {
        expect(shelljs.exec('node index.js build __tests__/skelo-app/testOutline.yml -s test/website/sidebars.js -d test/website/docs').code).toBe(0);
        const sidebars = require('../../test/website/sidebars.js');
        expect(sidebars.testSidebar[1].items[1].href).toBe('https://www.google.com');
        expect(sidebars.testSidebar[1].items[1]).toEqual({ type: 'link', label: 'External link', href: 'https://www.google.com' });
    })

    test('should generate a link item when topic has html property', () => {
        expect(shelljs.exec('node index.js build __tests__/skelo-app/testOutline.yml -s test/website/sidebars.js -d test/website/docs').code).toBe(0);
        const sidebars = require('../../test/website/sidebars.js');
        expect(sidebars.testSidebar[5]).toEqual({ type: 'html', value: "<a href=\"https://www.google.com\">Google</a>" });
    })

    test.todo('should generate link type generated_index')
    test.todo('should order topics in a category by label ascending by default')
    test.todo('should order topics in a category by slug ascending by default')
    test.todo('should order topics in a category by label in descending')
    test.todo('should order topics in a category by slug in descending')
})