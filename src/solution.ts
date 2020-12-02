export { Input } from './types';

import { Input, Solution } from './types';
import { getName, parseId } from './util/helper';
import { getIdFromPath } from './util/io';

export abstract class BaseSolution implements Solution {
    public abstract readonly description: string;
    public abstract solvePart1(lines: Input): string;
    public abstract solvePart2(lines: Input): string;

    get id(): string {
        return getIdFromPath(__filename);
    }

    get name(): string {
        return getName(this);
    }

    get year(): number {
        return parseId(this.id)[0];
    }

    get day(): number {
        return parseId(this.id)[1];
    }
}
