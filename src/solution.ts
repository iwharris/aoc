export { Input } from './types';

import { Input, Solution } from './types';
import { getName } from './util/helper';
import { parseInput } from './util/parser';

export abstract class BaseSolution implements Solution {
    public readonly description: string = '';

    public abstract solvePart1(lines: Input): string;

    public abstract solvePart2(lines: Input): string;

    public parseInput(raw: string): Input {
        return parseInput(raw, { preserveEmptyLines: true });
    }

    get name(): string {
        return getName(this);
    }
}
