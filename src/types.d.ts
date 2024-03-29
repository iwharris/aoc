export type SolutionMap = Record<string, Solution>;

export type Input = string[];

export type SolutionFunction = (lines: Input) => string;

/** Shape of an AoC solution */
export interface Solution {
    new?: () => Solution;

    /** Set to true to preserve empty lines when parsing input. */
    readonly preserveEmptyLines: boolean;

    /** Set to true to preserve leading/trailing whitespace when parsing input. */
    readonly preserveWhitespace: boolean;

    /** Name of the challenge, eg. "Chronal Calibration" */
    name: string;

    /** Challenge description, copied directly from adventofcode.com */
    description: string;

    /** Solution to Part 1 of the challenge */
    solvePart1?: SolutionFunction;

    /** Solution to Part 2 of the challenge */
    solvePart2?: SolutionFunction;

    /** Optional callback to parse raw input */
    parseInput: InputParserFunction;
}

export type InputParserFunction = (input: string) => Input;
