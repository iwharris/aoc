import { getName } from '../test-helper';
import solution from '../../src/challenge/2018/1';

const formatInput = (input: string): string[] => input.split(', ');

describe(getName(solution), () => {
    describe('Part 1', () => {
        it('should solve with simple inputs', () => {
            expect(solution.solvePart1(formatInput('+1, -2, +3, +1'))).toBe('3');
            expect(solution.solvePart1(formatInput('+1, +1, +1'))).toBe('3');
            expect(solution.solvePart1(formatInput('+1, +1, -2'))).toBe('0');
            expect(solution.solvePart1(formatInput('-1, -2, -3'))).toBe('-6');
        });
    });

    describe('Part 2', () => {
        it('should solve with simple inputs', () => {
            expect(solution.solvePart2(formatInput('+1, -1'))).toBe('0');
            expect(solution.solvePart2(formatInput('+3, +3, +4, -2, -4'))).toBe('10');
            expect(solution.solvePart2(formatInput('-6, +3, +8, +5, -6'))).toBe('5');
            expect(solution.solvePart2(formatInput('+7, +7, -2, -7, -4'))).toBe('14');
        });
    });
});
