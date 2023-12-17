import { BaseSolution } from '../solution';
import { Input } from '../types';
import { sum, toNum } from '../util/fp';

export class Solution extends BaseSolution {
    description = `

    `;

    public solvePart1(lines: Input): string {
        const springs = lines.map(parseLine);

        return sum(springs.map(([l, k]) => countPossibleSolutions(l, k))).toString();
    }

    public solvePart2(lines: Input): string {
        const springs = lines.map(parseLine2);

        return sum(
            springs.map(([l, k], i) => {
                // console.log(DP);
                DP = {};
                return f(l.join(''), k, 0, 0, 0);
            })
        ).toString();
    }
}

type Key = number[];
type Cell = '#' | '.' | '?';
type CellLine = Cell[];

const parseLine = (inputLine: string): [CellLine, Key] => {
    const [line, keyStr] = inputLine.split(' ');
    return [line.split('') as CellLine, keyStr.split(',').map(toNum)];
};

const parseLine2 = (inputLine: string): [CellLine, Key] => {
    const [line, keyStr] = inputLine.split(' ');
    const expandedLine = new Array(5).fill(line).join('?');
    const expandedKeyStr = new Array(5).fill(keyStr).join(',');

    return [expandedLine.split('') as CellLine, expandedKeyStr.split(',').map(toNum)];
};

const isValidLine = (line: string, key: Key): boolean => {
    const groups = line.split('.').filter(Boolean);
    return groups.length === key.length && key.every((k, i) => groups[i].length === k);
};

const countPossibleSolutions = (line: CellLine, key: Key): number => {
    const unknownIndices: number[] = [];
    let knownCellCount = 0;

    for (let i = 0; i < line.length; i++) {
        switch (line[i]) {
            case '?':
                // Where are the open ?s
                unknownIndices.push(i);
                break;
            case '#':
                // How many known cells are there?
                knownCellCount += 1;
                break;
        }
    }

    // console.log(unknownIndices);

    // How many cells do we have to place in our guesses?
    const unknownCount = sum(key) - knownCellCount;

    const allPossibleFills = makeCombinations(
        unknownIndices,
        unknownCount,
        0,
        new Array(unknownCount)
    );

    // console.log('a', allPossibleFills);

    let validCount = 0;
    // fill is a array of indices that need to be populated with
    for (const fill of allPossibleFills) {
        const l = [...line];
        for (const f of fill) {
            l[f] = '#'; // fill it in
        }
        const str = l.join('').replaceAll('?', '.'); // Replace all unfilled unknowns with blanks
        // console.log(`${str} ${key.join(',')} isValid=${isValidLine(str, key)}`);
        if (isValidLine(str, key)) validCount += 1;
    }

    return validCount;
};

const makeCombinations = (
    arr: number[],
    len: number,
    startPosition: number,
    buffer: number[]
): number[][] => {
    if (len === 0) {
        // console.log(buffer);
        return [[...buffer]];
    }
    const combos: number[][] = [];
    for (let i = startPosition; i <= arr.length - len; i++) {
        buffer[buffer.length - len] = arr[i];
        combos.push(...makeCombinations(arr, len - 1, i + 1, buffer));
    }

    return combos;
};

// DP solution

// # i == current position within dots
// # bi == current position within blocks
// # current == length of current block of '#'
// # state space is len(dots) * len(blocks) * len(dots)
let DP: Record<string, number> = {};
const f = (cells: string, key: Key, i: number, bi: number, current: number): number => {
    const cacheKey = [i, bi, current].join(',');
    if (Number.isInteger(DP[cacheKey])) return DP[cacheKey];
    if (i === cells.length) {
        if (bi === key.length && current === 0) return 1;
        else if (bi === key.length - 1 && key[bi] === current) return 1;
        else return 0;
    }
    let ans = 0;
    for (const c of ['.', '#']) {
        if (cells[i] === c || cells[i] === '?') {
            if (c === '.' && current === 0) {
                ans += f(cells, key, i + 1, bi, 0);
            } else if (c == '.' && current > 0 && bi < key.length && key[bi] === current) {
                ans += f(cells, key, i + 1, bi + 1, 0);
            } else if (c == '#') {
                ans += f(cells, key, i + 1, bi, current + 1);
            }
        }
    }
    DP[cacheKey] = ans;
    return ans;
};
