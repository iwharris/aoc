import { Solution } from '../../src/challenge/2018.8';
import { testName } from '../test-helper';

const solution = new Solution();

describe(testName(solution), () => {
    const input = ['2 3 0 3 10 11 12 1 1 0 1 99 2 1 1 2'];

    describe('Part 1', () => {
        it('should solve part 1', () => {
            expect(solution.solvePart1(input)).toBe('138');
        });
    });

    describe('Part 2', () => {
        it('should solve part 2', () => {
            expect(solution.solvePart2(input)).toBe('66');
        });
    });
});
