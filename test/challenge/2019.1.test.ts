import { Solution } from '../../src/challenge/2019.1';
import { testName } from '../test-helper';

const solution = new Solution();

describe(testName(solution), () => {
    describe('Part 1', () => {
        it('should solve part 1', () => {
            expect(solution.solvePart1(['12'])).toBe('2');
            expect(solution.solvePart1(['14'])).toBe('2');
            expect(solution.solvePart1(['1969'])).toBe('654');
            expect(solution.solvePart1(['100756'])).toBe('33583');
        });
    });

    describe('Part 2', () => {
        it('should solve part 2', () => {
            // expect(solution.solvePart2(input)).toBe('241861950');
        });
    });
});
