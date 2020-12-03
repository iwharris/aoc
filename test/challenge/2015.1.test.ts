import { testName } from '../test-helper';
import { Solution } from '../../src/challenge/2015.1';

const solution = new Solution();

describe(testName(solution), () => {
    describe('Part 1', () => {
        it('should solve with simple inputs', () => {
            expect(solution.solvePart1(['(())'])).toBe('0');
            expect(solution.solvePart1(['()()'])).toBe('0');

            expect(solution.solvePart1(['((('])).toBe('3');
            expect(solution.solvePart1(['(()(()('])).toBe('3');
            expect(solution.solvePart1(['))((((('])).toBe('3');

            expect(solution.solvePart1(['())'])).toBe('-1');
            expect(solution.solvePart1(['))('])).toBe('-1');

            expect(solution.solvePart1([')))'])).toBe('-3');
            expect(solution.solvePart1([')())())'])).toBe('-3');
        });
    });
});
