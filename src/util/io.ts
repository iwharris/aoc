import { PathLike, readFileSync, existsSync } from 'fs';
import fs from 'fs';
import { Solution } from '../types';

export const DEFAULT_ENCODING: BufferEncoding = 'utf8';

export const fileExists = (path: PathLike) => {
    return existsSync(path);
};

export const readInputFromStdin = (encoding: BufferEncoding = DEFAULT_ENCODING): string => {
    try {
        const data = readFileSync(0, encoding); // Read data from stdin

        return data;
    } catch (e) {
        console.warn(`Could not read input from stdin: ${e.message}`);
        return '';
    }
};

/** Falls back to reading stdin if the file can't be read */
export const readInputFromFile = async (
    path: string,
    encoding: BufferEncoding = DEFAULT_ENCODING
): Promise<string> => {
    try {
        const data = await fs.promises.readFile(path, { encoding });

        return data.toString();
    } catch (e) {
        console.warn(`Could not read input file from '${path}': ${e.message}`);
        return readInputFromStdin(encoding);
    }
};

export const importSolutionDynamically = async (path: string): Promise<Solution> => {
    const rawModule = await import(path);
    const RawSolution = rawModule?.default || rawModule?.Solution;
    if (typeof RawSolution !== 'function')
        throw new Error(`Module at path "${path}" has no solution`);
    return new RawSolution();
};

/**
 * Attempt to parse an ID of the form YYYY.DD from the file path
 */
export const getIdFromPath = (modulePath: string): string => {
    const [filename] = modulePath.split('/').reverse(); // glob paths always use unix separators

    const [year, day] = filename.split('.');

    return `${year}.${day}`;
};
