import { Solution } from '../../src/challenge/2020.1';
import { testName } from '../test-helper';

const solution = new Solution();

describe(testName(solution), () => {
    const input = ['1721', '979', '366', '299', '675', '1456'];

    describe('Part 1', () => {
        it('should solve part 1', () => {
            expect(solution.solvePart1(input)).toBe('514579');
        });
    });

    describe('Part 2', () => {
        it('should solve part 2', () => {
            expect(solution.solvePart2(input)).toBe('241861950');
        });
    });
});
