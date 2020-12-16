import { Solution } from '../../src/challenge/2020.14';
import { testName } from '../test-helper';

const solution = new Solution();

describe(testName(solution), () => {
    const input1 = solution.parseInput(
        `
        mask = XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X
        mem[8] = 11
        mem[7] = 101
        mem[8] = 0
        `
    );

    const input2 = solution.parseInput(
        `
        mask = 000000000000000000000000000000X1001X
        mem[42] = 100
        mask = 00000000000000000000000000000000X0XX
        mem[26] = 1
        `
    );

    describe('Part 1', () => {
        it('should solve part 1', () => {
            expect(solution.solvePart1(input1)).toBe('165');
        });
    });

    describe('Part 2', () => {
        it('should solve part 2', () => {
            expect(solution.solvePart2(input2)).toBe('208');
        });
    });
});
