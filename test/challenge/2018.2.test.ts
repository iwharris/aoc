import { testName } from '../test-helper';
import { Solution } from '../../src/challenge/2018.2';

const solution = new Solution();

describe(testName(solution), () => {
    describe('Part 1', () => {
        it('should solve with simple inputs', () => {
            const input = ['abcdef', 'bababc', 'abbcde', 'abcccd', 'aabcdd', 'abcdee', 'ababab'];
            expect(solution.solvePart1(input)).toBe('12');
        });
    });

    describe('Part 2', () => {
        it('should solve with simple inputs', () => {
            const input = ['abcde', 'fghij', 'klmno', 'pqrst', 'fguij', 'axcye', 'wvxyz'];

            expect(solution.solvePart2(input)).toBe('fgij');
        });
    });
});
