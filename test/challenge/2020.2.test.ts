import { Solution } from '../../src/challenge/2020.2';
import { testName } from '../test-helper';

const solution = new Solution();

describe(testName(solution), () => {
    const input = ['1-3 a: abcde', '1-3 b: cdefg', '2-9 c: ccccccccc'];

    describe('Part 1', () => {
        it('should solve part 1', () => {
            expect(solution.solvePart1(input)).toBe('2');
        });
    });

    describe('Part 2', () => {
        it('should solve part 2', () => {
            expect(solution.solvePart2(input)).toBe('1');
        });
    });
});
