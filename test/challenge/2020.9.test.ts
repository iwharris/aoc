import { Solution } from '../../src/challenge/2020.9';
import { parseInput } from '../../src/util/parser';
import { testName } from '../test-helper';

const solution = new Solution();

describe(testName(solution), () => {
    const input = parseInput(
        `
        35
        20
        15
        25
        47
        40
        62
        55
        65
        95
        102
        117
        150
        182
        127
        219
        299
        277
        309
        576
        `
    );

    describe('Part 1', () => {
        it('should solve part 1', () => {
            expect(solution.solvePart1(input, 5)).toBe('127');
        });
    });

    describe('Part 2', () => {
        it('should solve part 2', () => {
            expect(solution.solvePart2(input, 5)).toBe('62');
        });
    });
});
