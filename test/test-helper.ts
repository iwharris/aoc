export { getName } from '../src/util/helper';

import { Solution } from '../src/types';

/** Get a nice human-readable name for the unit tests for a Solution */
export const testName = (solution: Solution): string => {
    return solution.name;
};
