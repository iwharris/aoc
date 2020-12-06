import { Solution } from '../../src/challenge/2020.3';
import { parseInput } from '../../src/util/parser';
import { testName } from '../test-helper';

const solution = new Solution();

describe(testName(solution), () => {
    const input = parseInput(`
    ..##.......
    #...#...#..
    .#....#..#.
    ..#.#...#.#
    .#...##..#.
    ..#.##.....
    .#.#.#....#
    .#........#
    #.##...#...
    #...##....#
    .#..#...#.#
    `);

    describe('Part 1', () => {
        it('should solve part 1', () => {
            expect(solution.solvePart1(input)).toBe('7');
        });
    });

    describe('Part 2', () => {
        it('should solve part 2', () => {
            expect(solution.solvePart2(input)).toBe('336');
        });
    });
});
