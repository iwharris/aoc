import { Solution } from '../../src/challenge/2020.19';
import { testName } from '../test-helper';

const solution = new Solution();

describe(testName(solution), () => {
    const input = solution.parseInput(
        `0: 4 1 5
        1: 2 3 | 3 2
        2: 4 4 | 5 5
        3: 4 5 | 5 4
        4: "a"
        5: "b"
        
        ababbb
        bababa
        abbbab
        aaabbb
        aaaabbb`
    );

    describe('Part 1', () => {
        it('should solve part 1', () => {
            expect(solution.solvePart1(input)).toBe('2');
        });
    });

    describe('Part 2', () => {
        it('should solve part 2', () => {
            // expect(solution.solvePart2(input)).toBe('848');
        });
    });
});
