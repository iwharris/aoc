import { parseInput, parseTokensFromSplit } from '../../src/util/parser';

describe('parseInput', () => {
    it('should trim lines and drop empty ones by default', () => {
        expect(parseInput('  a \n\n b\n')).toEqual(['a', 'b']);
    });

    it('should preserve whitespace and empty lines when asked', () => {
        const options = { preserveWhitespace: true, preserveEmptyLines: true };

        expect(parseInput('  a \n\n b', options)).toEqual(['  a ', '', ' b']);
    });

    it('should handle Windows line endings', () => {
        const options = { preserveWhitespace: true, preserveEmptyLines: true };

        expect(parseInput('  a\r\n\r\nb\r\n', options)).toEqual(['  a', '', 'b', '']);
    });
});

describe('parseTokensFromSplit', () => {
    it('should split each line on the separator', () => {
        expect(parseTokensFromSplit(['a,b', 'c'], { separator: ',' })).toEqual([['a', 'b'], ['c']]);
    });

    it('should split on spaces by default', () => {
        expect(parseTokensFromSplit(['a b'])).toEqual([['a', 'b']]);
    });
});
