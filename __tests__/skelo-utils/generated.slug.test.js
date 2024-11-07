const assert = require('assert');
const {slug} = require('../../lib/skelo-utils');

describe('slug', () => {
  it('should generate a slug from the input string', () => {
    assert.strictEqual(slug('Hello World'), 'hello-world');
    assert.strictEqual(slug('Special!Characters@Here'), 'special-characters-here');
    assert.strictEqual(slug(''), '');
    assert.strictEqual(slug('    '), '');
    assert.strictEqual(slug('  some!!  spaces'), 'some-spaces');
  });
});