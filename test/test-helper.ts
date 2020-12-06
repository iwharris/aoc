export { getName } from '../src/util/helper';

import { Input, Solution } from '../src/types';

/** Get a nice human-readable name for the unit tests for a Solution */
export const testName = (solution: Solution): string => {
    return solution.name;
};

/** Takes a raw string and massages it into an Input for a Solution */
export const parse = (raw: string): Input =>
    raw
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean);
