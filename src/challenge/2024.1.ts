import { BaseSolution } from '../solution';
import { Input } from '../types';
import { countOccurrences } from '../util/count';
import { sum } from '../util/fp';

const parseInput = (lines: Input) => {
    const arr1: number[] = [];
    const arr2: number[] = [];
    for (const line of lines) {
        const [c1, c2] = line.split(' ').filter(Boolean);
        arr1.push(parseInt(c1));
        arr2.push(parseInt(c2));
    }

    return [arr1, arr2];
};

export class Solution extends BaseSolution {
    description = ``;

    public solvePart1(lines: Input): string {
        const [arr1, arr2] = parseInput(lines);

        arr1.sort();
        arr2.sort();

        const diffs = arr1.map((c1, i) => {
            const c2 = arr2[i];
            return Math.abs(c1 - c2);
        });

        return sum(diffs).toString();
    }

    public solvePart2(lines: Input): string {
        const [arr1, arr2] = parseInput(lines);
        const occurrences = countOccurrences(arr2);

        return sum(
            arr1.map((num) => {
                return num * (occurrences[num] || 0);
            })
        ).toString();
    }
}
