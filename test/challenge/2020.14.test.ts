import { Solution } from '../../src/challenge/2020.14';
import { testName } from '../test-helper';

const solution = new Solution();

describe(testName(solution), () => {
    const input = solution.parseInput(
        `
        mask = XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X
        mem[8] = 11
        mem[7] = 101
        mem[8] = 0
        `
    );

    describe('Part 1', () => {
        it('should solve part 1', () => {
            expect(solution.solvePart1(input)).toBe('165');
        });
    });

    describe('Part 2', () => {
        it('should solve part 2', () => {
            //
        });
    });
});
