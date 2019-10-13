import c_18_1 from './2018/1';
import { ChallengeInput } from '../util/io';

// TODO populate these dynamically instead of hardcoding every import
export const challenges: readonly [string, Solution][] = Object.entries({
    '2018.1': c_18_1,
});

export type SolutionFunction = (lines: ChallengeInput) => string;

export interface Solution {
    description: string;
    solvePart1?: SolutionFunction;
    solvePart2?: SolutionFunction;
}

export class Solutions {
    private solutions: Map<string, Solution>;

    constructor(solutions: Iterable<readonly [string, Solution]>) {
        this.solutions = new Map(solutions);
    }

    get(key: string): Solution {
        const solution = this.solutions.get(key);

        if (!solution) throw new Error(`Solution ${key} not found`);

        return solution;
    }

    list(): [string, Solution][] {
        return Array.from(this.solutions.entries()).sort(([a], [b]) => Number(a) - Number(b));
    }

    info(key: string): string {
        const solution = this.get(key);

        return solution.description;
    }

    solveChallenge(key: string, input: ChallengeInput): (string | null)[] {
        const solution = this.get(key);

        return [
            !!solution.solvePart1 ? solution.solvePart1(input) : null,
            !!solution.solvePart2 ? solution.solvePart2(input) : null,
        ];
    }

    // static async load(): Promise<Solutions> {
    //     console.log('dirname', __dirname);
    //     const directories = await readdirAsync(__dirname);
    //     console.log(directories);

    //     return new Solutions([['2018.1', c2018_1]]);
    // }
}