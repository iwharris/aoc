import c_18_1 from './2018/1';

// TODO populate these dynamically instead of hardcoding every import
export const challenges = Object.entries({
    '2018.1': c_18_1,
});

import { readdirAsync } from '../util/io';

export type SolutionFunction = (lines: string[]) => string;

export interface ISolution {
    name: string;
    description: string;
    solvePart1?: SolutionFunction;
    solvePart2?: SolutionFunction;
}

export class Solutions {
    private solutions: Map<string, ISolution>;

    constructor(solutions: Iterable<readonly [string, ISolution]>) {
        this.solutions = new Map(solutions);
    }

    get(key: string): ISolution {
        const solution = this.solutions.get(key);

        if (!solution) throw new Error(`Solution ${key} not found`);

        return solution;
    }

    list(): [string, ISolution][] {
        return Array.from(this.solutions.entries())
            .sort(([a], [b]) => Number(a) - Number(b));
    }

    info(key: string): string {
        const solution = this.get(key);

        return solution.description;
    }

    solveChallenge(key: string, input: string[]): (string | null)[] {
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
