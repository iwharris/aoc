import { Solution } from '../../src/challenge/2020.13';
import { testName } from '../test-helper';

const solution = new Solution();

describe(testName(solution), () => {
    const input = solution.parseInput(
        `
        939
        7,13,x,x,59,x,31,19
        `
    );

    describe('Part 1', () => {
        it('should solve part 1', () => {
            expect(solution.solvePart1(input)).toBe('295');
        });
    });

    describe('Part 2', () => {
        it('should solve part 2', () => {
            expect(solution.solvePart2(input)).toBe('1068781');
        });
    });
});
