import { Solution } from '../../src/challenge/2020.17';
import { testName } from '../test-helper';

const solution = new Solution();

describe(testName(solution), () => {
    const input = solution.parseInput(
        `
        .#.
        ..#
        ###
        `
    );

    describe('Part 1', () => {
        it('should solve part 1', () => {
            expect(solution.solvePart1(input)).toBe('112');
        });
    });

    describe('Part 2', () => {
        it('should solve part 2', () => {
            expect(solution.solvePart2(input)).toBe('848');
        });
    });
});
