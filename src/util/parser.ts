import { Input } from '../types';

export interface ParseOptions {
    preserveEmptyLines?: boolean;
    preserveWhitespace?: boolean;
}

export const parseInput = (rawInput: string, options: ParseOptions = {}): Input =>
    rawInput
        .split('\n') // Split data on newlines
        .map((str: string) => (options.preserveEmptyLines ? str : str.trim())) // Trim whitespace
        .filter((line) => (options.preserveEmptyLines ? true : Boolean(line))); // Omit empty (falsy) lines
