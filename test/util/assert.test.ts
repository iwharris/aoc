import { assert } from '../../src/util/assert';

describe('assert', () => {
    it('should do nothing when true and throw when false', () => {
        expect(() => assert(true)).not.toThrow();
        expect(() => assert(false)).toThrow('AssertionError');
    });
});
