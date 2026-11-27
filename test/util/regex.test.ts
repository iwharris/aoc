import { extractAllMatches } from '../../src/util/regex';

describe('extractAllMatches', () => {
    it('should return every match', () => {
        expect(extractAllMatches('p=0,4 v=3,-3', /-?\d+/)).toEqual(['0', '4', '3', '-3']);
    });

    it('should return an empty array when nothing matches', () => {
        expect(extractAllMatches('abc', /\d/)).toEqual([]);
    });

    it('should accept a regex that is already global', () => {
        expect(extractAllMatches('a1b2', /\d/g)).toEqual(['1', '2']);
    });

    it.each([
        ['i', 'aAaA', /a/i, ['a', 'A', 'a', 'A']],
        ['m', 'x1\ny2', /^\w\d$/m, ['x1', 'y2']],
        ['s', 'a\nb', /a.b/s, ['a\nb']],
        ['u', '😀x', /./u, ['😀', 'x']],
    ])('should respect the %s flag', (_flag, input, regex, expected) => {
        expect(extractAllMatches(input, regex)).toEqual(expected);
    });

    it('should return full matches rather than capture groups', () => {
        expect(extractAllMatches('X+94, Y+34', /\+(\d+)/)).toEqual(['+94', '+34']);
    });

    it("should not modify the caller's regex", () => {
        const regex = /\d/g;
        regex.lastIndex = 1;

        expect(extractAllMatches('123', regex)).toEqual(['1', '2', '3']);
        expect(regex.lastIndex).toBe(1);
        expect(regex.flags).toBe('g');
    });
});
