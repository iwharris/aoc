import { Solution } from '../types';

export const getName = (solution: Solution): string => {
    // Not every solution has had its description filled in
    if (!solution.description?.trim()) return '(untitled)';

    const matches = /^[\t\n -]*Day \d+:(.*?)[ \t-]*\n/.exec(solution.description);

    if (!matches) {
        throw new Error(`Description is malformed: "${solution.description.slice(0, 100)}..."`);
    }

    return matches[1].trim();
};

export const parseId = (id: string): [number, number] => {
    const [year, day] = id.split('.').map((s) => parseInt(s));
    if (!year || !day) {
        throw new Error(`Cannot parse ID from "${id}": ID must be in the form YYYY.DD`);
    }
    return [year, day];
};

export const normalizeId = (id: string): string => parseId(id).join('.');
