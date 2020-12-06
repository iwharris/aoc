import { Solution } from '../../src/challenge/2020.3';
import { parse, testName } from '../test-helper';

const solution = new Solution();

describe(testName(solution), () => {
    const input = parse(`
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
});
