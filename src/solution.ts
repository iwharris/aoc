export { Input } from './types';

import { Input, Solution } from './types';
import { getName } from './util/helper';
import { parseInput } from './util/parser';

export abstract class BaseSolution implements Solution {
    public readonly description: string = '';

    // Default config flags
    preserveEmptyLines = false;
    preserveWhitespace = false;

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
