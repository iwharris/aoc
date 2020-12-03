export { Input } from './types';

import { Input, Solution } from './types';
import { getName } from './util/helper';

export abstract class BaseSolution implements Solution {
    public readonly description: string = '';

    public abstract solvePart1(lines: Input): string;

    public abstract solvePart2(lines: Input): string;

    get name(): string {
        return getName(this);
    }
}
