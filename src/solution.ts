export { Input } from './types';

import { Input, Solution } from './types';
import { NotImplementedError } from './util/error';
import { getName } from './util/helper';

export class BaseSolution implements Solution {
    public readonly description: string = '';

    solvePart1(lines: Input): string {
        throw new NotImplementedError(`solvePart1() is not implemented`);
    }

    solvePart2(lines: Input): string {
        throw new NotImplementedError(`solvePart2() is not implemented`);
    }

    get name(): string {
        return getName(this);
    }
}
