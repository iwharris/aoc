import solution from '../../src/challenge/2018/6';
import { getName } from '../test-helper';

describe(getName(solution), () => {
    const input = ['1, 1', '1, 6', '8, 3', '3, 4', '5, 5', '8, 9'];

    describe('Part 1', () => {
        it('should solve part 1', () => {
            expect(solution.solvePart1(input)).toBe('17');
        });
    });

    describe('Part 2', () => {
        it('should solve part 2', () => {
            expect(solution.solvePart2(input, 32)).toBe('16');
        });
    });
});
