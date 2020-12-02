import { Solution } from 'src/types';

export const getName = (solution: Solution): string => {
    if (!solution.description)
        throw new Error(`Solution is missing a description: ${JSON.stringify(solution)}`);
    const matches = /^[\n -]*Day \d+:([\w\s]+)[ -]*\n/.exec(solution.description);

    if (!matches) {
        throw new Error(`Description is malformed: "${solution.description.slice(100)}..."`);
    }

    return matches[1].trim();
};

export const parseId = (id: string): [number, number] => {
    const [year, day] = id?.split('.').map((s) => parseInt(s));
    if (!year || !day) {
        throw new Error(`Cannot parse ID from "${id}": ID must be in the form YYYY.DD`);
    }
    return [year, day];
};

export const normalizeId = (id: string): string => parseId(id).join('.');
