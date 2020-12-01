import { readFileSync } from 'fs';
import fs from 'fs';
import { ChallengeInput, Solution } from 'src/types';

const parseInput = (rawInput: string): ChallengeInput =>
    rawInput
        .split('\n') // Split data on newlines
        .map((str: string) => str.trim()) // Trim whitespace
        .filter(Boolean); // Omit empty (falsy) lines

export const readInputFromStdin = (encoding: string = 'utf8'): ChallengeInput => {
    const data = readFileSync(0, encoding); // Read data from stdin

    return parseInput(data);
};

export const readInputFromFile = async (
    path: string,
    encoding: string = 'utf8'
): Promise<ChallengeInput> => {
    const data = await fs.promises.readFile(path, { encoding });

    return parseInput(data.toString());
};

export const importSolutionDynamically = async (path: string): Promise<Solution> => {
    const rawModule = await import(path);

    // Temporary: resolve modules that use `export default`
    const module = rawModule?.default || rawModule;

    if (!module) throw new Error(`Module at path "${path}" is empty`);

    return module;
};

/**
 * Attempt to parse an ID of the form YYYY.DD from the file path
 * @param path
 */
export const parseIdFromPath = (modulePath: string): string => {
    const [rawDay, year] = modulePath.split('/').reverse(); // glob paths always use unix separators

    const [day] = rawDay.split('.');

    return `${year}.${day}`;
};
