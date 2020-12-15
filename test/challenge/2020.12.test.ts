import { Solution } from '../../src/challenge/2020.12';
import { testName } from '../test-helper';

const solution = new Solution();

describe(testName(solution), () => {
    const input = solution.parseInput(
        `
        F10
        N3
        F7
        R90
        F11
        `
    );

    describe('Part 1', () => {
        it('should solve part 1', () => {
            expect(solution.solvePart1(input)).toBe('25');
        });
    });

    describe('Part 2', () => {
        it('should solve part 2', () => {
            expect(solution.solvePart2(input)).toBe('286');
        });
    });
});
