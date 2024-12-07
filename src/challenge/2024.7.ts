import assert from 'assert';
import { BaseSolution } from '../solution';
import { Input } from '../types';
import { sum } from '../util/fp';

const solve = (lines: Input, isPart2 = false): string => {
    const isValid = (target: number, values: number[]) => {
        assert(values.length >= 2);

        // Base case, figure out if two values can equal the target
        if (values.length === 2) {
            const [a, b] = values;
            return (
                target === a + b || target === a * b || (isPart2 && target === parseInt(`${a}${b}`))
            );
        }

        const [val] = values.slice(-1);
        const rest = values.slice(0, -1);

        // work backwards via subtraction. If subtraction results in negative number, it can't possibly be valid so short circuit
        if (target - val > 0 && isValid(target - val, rest)) {
            return true;
        }

        // if number doesn't divide evenly then it can't be correct, so short circuit
        if (Number.isInteger(target / val) && isValid(target / val, rest)) {
            return true;
        }

        // concat case: if target string endsWith the value, concat is possible - otherwise, short circuit
        if (
            isPart2 &&
            target.toString().endsWith(val.toString()) &&
            isValid(parseInt(target.toString().slice(0, -val.toString().length)), rest)
        ) {
            return true;
        }

        return false;
    };

    return sum(
        lines
            .map((line) => {
                // Parse
                const [targetStr, testValuesStr] = line.split(':');
                const target = parseInt(targetStr);
                const testValues = testValuesStr
                    .split(' ')
                    .filter(Boolean)
                    .map((token) => parseInt(token));

                return { target, testValues };
            })
            .filter(({ target, testValues }) => isValid(target, testValues))
            .map(({ target }) => target)
    ).toString();
};

export class Solution extends BaseSolution {
    description = ``;

    public solvePart1(lines: Input): string {
        return solve(lines);
    }

    public solvePart2(lines: Input): string {
        return solve(lines, true);
    }
}
