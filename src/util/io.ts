import { readFileSync } from 'fs';
import fs from 'fs';
import { Input, Solution } from '../types';

const parseInput = (rawInput: string): Input =>
    rawInput
        .split('\n') // Split data on newlines
        .map((str: string) => str.trim()) // Trim whitespace
        .filter(Boolean); // Omit empty (falsy) lines

export const readInputFromStdin = (encoding: string = 'utf8'): Input => {
    const data = readFileSync(0, encoding); // Read data from stdin

    return parseInput(data);
};

export const readInputFromFile = async (
    path: string,
    encoding: string = 'utf8'
): Promise<Input> => {
    const data = await fs.promises.readFile(path, { encoding });

    return parseInput(data.toString());
};

export const importSolutionDynamically = async (path: string): Promise<Solution> => {
    const rawModule = await import(path);
    const RawSolution = rawModule?.default || rawModule?.Solution;
    const instance = new RawSolution();
    if (!instance) throw new Error(`Module at path "${path}" is empty`);
    return instance;
};

/**
 * Attempt to parse an ID of the form YYYY.DD from the file path
 * @param path
 */
export const getIdFromPath = (modulePath: string): string => {
    const [filename] = modulePath.split('/').reverse(); // glob paths always use unix separators

    const [year, day] = filename.split('.');

    return `${year}.${day}`;
};
