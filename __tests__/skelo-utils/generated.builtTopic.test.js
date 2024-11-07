const assert = require('assert');
const { buildTopic } = require('../../lib/skelo-utils');

describe('buildTopic', () => {
    it('should build a topic from a valid item with no options', () => {
        const item = { label: 'Test Label' };
        const result = buildTopic(item);
        assert.strictEqual(result, 'test-label');
    });

    it('should build a topic from a valid item with options', () => {
        const item = { label: 'Test Label' };
        const options = { additionalInfo: 'info' };
        const result = buildTopic(item, options);
        assert.strictEqual(result, 'test-label');
    });

    it('should throw an error for a null item', () => {
        const item = null;
        assert.throws(() => {
            buildTopic(item);
        }, /Item must not be null or undefined/);
    });

    it('should throw an error for an undefined item', () => {
        let item;
        assert.throws(() => {
            buildTopic(item);
        }, /Item must not be null or undefined/);
    });
});