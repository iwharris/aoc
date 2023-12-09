import { BaseSolution } from '../solution';
import { Input } from '../types';
import { sum, toNum } from '../util/fp';

export class Solution extends BaseSolution {
    description = `

    `;

    public solvePart1(lines: Input): string {
        const inputs = lines.map(parseLine);

        return sum(inputs.map(extrapolateForwards)).toString();
    }

    public solvePart2(lines: Input): string {
        const inputs = lines.map(parseLine);

        return sum(inputs.map(extrapolateBackwards)).toString();
    }
}

const parseLine = (line: string): number[] => line.split(' ').map(toNum);

const extrapolateForwards = (sequence: number[]): number => {
    if (sequence.every((n) => n === 0)) {
        // console.log('bottomed out');
        return 0;
    }

    const diffs = sequence.map((n, i) => {
        if (i === sequence.length) {
            return 0;
        }
        return sequence[i + 1] - n;
    });
    diffs.pop(); // remove last element

    // console.log(`${sequence.join(',')} => ${diffs.join(`,`)}`);

    const ex = extrapolateForwards(diffs);
    // console.log(`extrapolating ${ex} which gives us ${sequence[sequence.length - 1] + ex}`);
    return sequence[sequence.length - 1] + ex;
};

const extrapolateBackwards = (sequence: number[]): number => {
    if (sequence.every((n) => n === 0)) {
        // console.log('bottomed out');
        return 0;
    }

    const diffs = sequence.map((n, i) => {
        if (i === sequence.length) {
            return 0;
        }
        return sequence[i + 1] - n;
    });
    diffs.pop(); // remove last element

    // console.log(`${sequence.join(',')} => ${diffs.join(`,`)}`);

    const ex = extrapolateBackwards(diffs);
    // console.log(`extrapolating ${ex} which gives us ${sequence[0] - ex}`);
    return sequence[0] - ex;
};
