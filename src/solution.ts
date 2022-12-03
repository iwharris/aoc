export { Input } from './types';

import { Input, Solution } from './types';
import { getName } from './util/helper';
import { parseInput } from './util/parser';

export abstract class BaseSolution implements Solution {
    public readonly description: string = '';

    /** Set to true to preserve empty lines when parsing input. */
    public readonly preserveEmptyLines: boolean = false;

    /** Set to true to preserve leading/trailing whitespace when parsing input. */
    public readonly preserveWhitespace: boolean = false;

    public abstract solvePart1(lines: Input): string;

    public abstract solvePart2(lines: Input): string;

    public parseInput(raw: string): Input {
        return parseInput(raw, {
            preserveEmptyLines: this.preserveEmptyLines,
            preserveWhitespace: this.preserveWhitespace,
        });
    }

    get name(): string {
        return getName(this);
    }
}
