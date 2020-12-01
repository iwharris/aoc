import { glob } from 'glob';
import util from 'util';
import { ChallengeInput, Solution, SolutionMap } from 'src/types';
import { parseId } from '../util/helper';
import { importSolutionDynamically, parseIdFromPath } from '../util/io';

const globAsync = util.promisify(glob);

export const getSolution = async (id: string): Promise<Solution> => {
    const [year, day] = parseId(id);
    const fullPath = `${__dirname}/${year}/${day}`;
    return importSolutionDynamically(fullPath);
};

export const getSolutions = async (): Promise<SolutionMap> => {
    const solutionMap = {};

    const modules = await globAsync(`${__dirname}/*/*.[tj]s`);

    for (const modulePath of modules) {
        const solution: Solution = await importSolutionDynamically(modulePath);
        const id = parseIdFromPath(modulePath);
        solutionMap[id] = solution;
    }

    return solutionMap;
};

export const getInfo = async (id: string): Promise<string> => {
    const solution = await getSolution(id);

    return solution.description;
};

export const solveChallenge = async (
    key: string,
    input: ChallengeInput
): Promise<(string | null)[]> => {
    const solution = await getSolution(key);

    return [
        !!solution.solvePart1 ? solution.solvePart1(input) : null,
        !!solution.solvePart2 ? solution.solvePart2(input) : null,
    ];
};
