import { countOccurrences } from '../../src/util/count';

describe('countOccurrences', () => {
    it('should count each value', () => {
        expect(countOccurrences(['a', 'b', 'a', 'a'])).toEqual({ a: 3, b: 1 });
        expect(countOccurrences([3, 3, 4])).toEqual({ 3: 2, 4: 1 });
        expect(countOccurrences(new Set<string>())).toEqual({});
    });

    it('should count values that share a name with Object members', () => {
        const counts = countOccurrences(['constructor', '__proto__', '__proto__', 'toString']);

        expect(Object.entries(counts)).toEqual([
            ['constructor', 1],
            ['__proto__', 2],
            ['toString', 1],
        ]);
    });
});
