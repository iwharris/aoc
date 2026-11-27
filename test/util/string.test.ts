import { countSubstringOccurrences } from '../../src/util/string';

describe('countSubstringOccurrences', () => {
    it.each([
        ['banana', 'a', 3],
        ['banana', 'z', 0],
        ['aaaa', 'aa', 2],
        ['a.b', '.', 1],
        ['(()', '(', 2],
        ['a+a+', 'a+', 2],
        ['abc', '', 0],
    ])('should count %j containing %j literally', (string, substr, count) => {
        expect(countSubstringOccurrences(string, substr)).toBe(count);
    });
});
