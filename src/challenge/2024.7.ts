import { BaseSolution } from '../solution';
import { Input } from '../types';
import { sum } from '../util/fp';

type Operator = '*' | '+' | '|';

const OPERATION: Record<Operator, (a: number, b: number) => number> = {
    '*': (a, b) => a * b,
    '+': (a, b) => a + b,
    '|': (a, b) => parseInt(`${a}${b}`), // concat
};

const matchesTarget = (testValues: TestValues, target: number): boolean => {
    let acc = 0;
    let operand: number;
    let operator: Operator;

    for (let i = 0; i < testValues.length; i += 2) {
        operator = testValues[i] as Operator;
        operand = testValues[i + 1] as number;

        acc = OPERATION[operator](acc, operand);
    }

    if (acc === target) {
        // console.log(`${testValues.join(' ')} equals ${target}`);
    }

    return acc === target;
};

const permute = (arr: TestValues, remaining: TestValues): TestValues[] => {
    if (remaining.length === 1) {
        return [[...arr, remaining[0]]];
    }

    const [cur, ...rest] = remaining;

    return [
        // add
        permute([...arr, cur, '+'], rest),
        // mult
        permute([...arr, cur, '*'], rest),
    ].flat();
};

const permute2 = (arr: TestValues, remaining: TestValues): TestValues[] => {
    if (remaining.length === 1) {
        return [[...arr, remaining[0]]];
    }

    const [cur, ...rest] = remaining;

    return [
        // add
        permute2([...arr, cur, '+'], rest),
        // mult
        permute2([...arr, cur, '*'], rest),
        // concat
        permute2([...arr, cur, '|'], rest),
    ].flat();
};

type TestValues = Array<number | Operator>;

export class Solution extends BaseSolution {
    description = ``;

    public solvePart1(lines: Input): string {
        return sum(
            lines
                // .slice(0, 2)
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
                .map(({ target, testValues }) => {
                    // Generate test values with permutations of operators
                    const operations = permute(['+'], testValues);
                    const match = operations.some((op) => matchesTarget(op, target));

                    return { target, testValues, match };
                })
                .filter(({ match }) => !!match)
                .map(({ target }) => target)
        ).toString();
        // .forEach((val) => {
        //     console.log(val);
        // });
    }

    public solvePart2(lines: Input): string {
        return sum(
            lines
                // .slice(4, 5)
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
                .map(({ target, testValues }) => {
                    // Generate test values with permutations of operators
                    const operations = permute2(['+'], testValues);
                    // console.log(operations);
                    const match = operations.some((op) => matchesTarget(op, target));

                    return { target, testValues, match };
                })
                .filter(({ match }) => !!match)
                .map(({ target }) => target)
        ).toString();
    }
}
