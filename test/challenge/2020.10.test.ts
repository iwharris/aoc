import { Solution } from '../../src/challenge/2020.10';
import { testName } from '../test-helper';

const solution = new Solution();

describe(testName(solution), () => {
    const input1 = solution.parseInput(
        `
        16
        10
        15
        5
        1
        11
        7
        19
        6
        12
        4
        `
    );

    const input2 = solution.parseInput(
        `
        28
        33
        18
        42
        31
        14
        46
        20
        48
        47
        24
        23
        49
        45
        19
        38
        39
        11
        1
        32
        25
        35
        8
        17
        7
        9
        4
        2
        34
        10
        3
        `
    );

    describe('Part 1', () => {
        it('should solve part 1', () => {
            expect(solution.solvePart1(input1)).toBe('35');
            expect(solution.solvePart1(input2)).toBe('220');
        });
    });

    describe('Part 2', () => {
        it('should solve part 2', () => {
            expect(solution.solvePart2(input1)).toBe('8');
            expect(solution.solvePart2(input2)).toBe('19208');
        });
    });
});
