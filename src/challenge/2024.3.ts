import { BaseSolution } from '../solution';
import { Input } from '../types';
import { sum } from '../util/fp';

const extractMuls = (line: string): [number, number][] => {
    const allMatches = line.match(/mul\(\d+,\d+\)/g);

    return (
        allMatches?.map((m) => {
            const [m1, m2] = m.match(/\d+/g) ?? ['0', '0'];

            return [parseInt(m1), parseInt(m2)];
        }) ?? []
    );
};

const extractMulsWithConditionals = (line: string): [number, number][] => {
    const allMatches = line.match(/(mul\(\d+,\d+\))|(do\(\)|(don't\(\)))/g);

    const muls: [number, number][] = [];
    let isProcessingMuls = true;

    allMatches?.forEach((m) => {
        if (m === 'do()') {
            isProcessingMuls = true;
            // console.log(`saw do()`);
        } else if (m === `don't()`) {
            isProcessingMuls = false;
            // console.log(`saw don't()`);
        } else if (m.startsWith('mul')) {
            if (isProcessingMuls) {
                const [m1, m2] = m.match(/\d+/g) ?? ['0', '0'];
                muls.push([parseInt(m1), parseInt(m2)]);
                // console.log(`processed ${m}`);
            } else {
                // console.log(`skipped ${m}`);
            }
        }
    }) ?? [];

    return muls;
};

export class Solution extends BaseSolution {
    description = ``;

    public solvePart1(lines: Input): string {
        const oneLongString = lines.join('');

        const muls = extractMuls(oneLongString);
        // console.log(muls);

        return sum(muls.map(([m1, m2]) => m1 * m2)).toString();
    }

    public solvePart2(lines: Input): string {
        const oneLongString = lines.join('');

        const muls = extractMulsWithConditionals(oneLongString);

        return sum(muls.map(([m1, m2]) => m1 * m2)).toString();
    }
}
