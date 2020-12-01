import * as solution from '../../src/challenge/2018/5';
import { getName } from '../test-helper';

describe(getName(solution), () => {
    const input = ['dabAcCaCBAcCcaDA'];

    describe('Part 1', () => {
        it('should solve part 1', () => {
            expect(solution.solvePart1(input)).toBe('10');
        });
    });

    describe('Part 2', () => {
        it('should solve part 2', () => {
            expect(solution.solvePart2(input)).toBe('4');
        });
    });
});
