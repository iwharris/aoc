export type SolutionMap = Record<string, Solution>;

export type Input = string[];

export type SolutionFunction = (lines: Input) => string;

/** Shape of an AoC solution */
export interface Solution {
    new?: () => Solution;

    /** ID of the challenge and solution in the form YYYY.DD */
    id: string;

    /** Name of the challenge, eg. "Chronal Calibration" */
    name: string;

    /** Challenge description, copied directly from adventofcode.com */
    description: string;

    /** Year (2015-) of the challenge */
    year: number;

    /** Day (1-31) of the challenge */
    day: number;

    /** Solution to Part 1 of the challenge */
    solvePart1?: SolutionFunction;

    /** Solution to Part 2 of the challenge */
    solvePart2?: SolutionFunction;
}
