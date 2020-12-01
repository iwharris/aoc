export type SolutionMap = Record<string, Solution>;

export type ChallengeInput = string[];

export type SolutionFunction = (lines: ChallengeInput) => string;

export interface Solution {
    description: string;
    solvePart1?: SolutionFunction;
    solvePart2?: SolutionFunction;
}
