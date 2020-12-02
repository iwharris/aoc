export { getName } from '../src/util/helper';

import { Solution } from '../src/types';

export const testName = (solution: Solution): string => {
    return `${solution.id}: ${solution.name}`;
};
