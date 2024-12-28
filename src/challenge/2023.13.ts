import { BaseSolution } from '../solution';
import { Input } from '../types';
import { sum } from '../util/fp';
import { Grid } from '../util/grid';
import { Point } from '../util/point';

export class Solution extends BaseSolution {
    preserveEmptyLines = true;

    description = `

    `;

    public solvePart1(lines: Input): string {
        const grids = parseInput(lines);
        return sum(grids.map((g) => computeSymmetryScore(g, 1))).toString();
    }

    public solvePart2(lines: Input): string {
        const grids = parseInput(lines);
        return sum(grids.map((g) => computeSymmetryScore(g, 2))).toString();
    }
}

const parseInput = (lines: Input) =>
    lines
        .join('\n')
        .split('\n\n')
        .map((block) => {
            // console.log(`\n${block}\n`);
            return Grid.loadFromStrings(block.trim().split('\n'));
        });

type ScanType = 'v' | 'h';
const computeSymmetryScore = (grid: Grid, part: 1 | 2): number => {
    for (const scanType of ['v', 'h'] as ScanType[]) {
        // Check for reflection on this axis
        const dim = scanType === 'v' ? grid.width : grid.height;

        // Will scan outwards on this axis, away from the plane of reflection
        const otherDim = scanType === 'v' ? grid.height : grid.width;

        for (let i = 1; i < dim; i += 1) {
            let allMatch = true;
            let diffs = 0;
            // for each point along the plane of reflection
            for (let j = 0; j < otherDim; j += 1) {
                if (part === 1 && !allMatch) break;
                if (part === 2 && diffs > 1) break;
                // scan outwards until we go out-of-bounds

                // if scanning for vertical reflection, i = the x-offset and j = the y-offset
                // if scanning for horizontal reflection, i = the y-offset and j = the x-offset
                const origin: Point = scanType === 'v' ? [i, j] : [j, i];
                const iterators =
                    scanType === 'v'
                        ? [
                              grid.linePointGenerator([-1, 0], origin, {
                                  excludeOrigin: true,
                              }),
                              grid.linePointGenerator([1, 0], origin, {
                                  excludeOrigin: false,
                              }),
                          ]
                        : [
                              grid.linePointGenerator([0, -1], origin, {
                                  excludeOrigin: true,
                              }),

                              grid.linePointGenerator([0, 1], origin, {
                                  excludeOrigin: false,
                              }),
                          ];
                const [stringA, stringB] = iterators
                    .map((iter) => [...iter].map((pt) => grid.getValue(pt)).join(''))
                    .map((str, _i, strings) =>
                        str.slice(0, Math.min(strings[0].length, strings[1].length))
                    );

                // console.log(stringA, '<->', stringB);

                allMatch = stringA === stringB;
                diffs += stringA.split('').filter((a, i) => a !== stringB[i]).length;
            }
            if (part === 1 && allMatch) {
                // console.log(`think we found reflection on scanType=${scanType} i=${i}`);
                return scanType === 'v' ? i : 100 * i;
            } else if (part === 2 && diffs === 1) {
                // console.log(
                //     `think we found a reflection with single smudge on scanType=${scanType} i=${i}`
                // );
                return scanType === 'v' ? i : 100 * i;
            }
        }
    }
    console.error('did not find a reflection for grid\n', grid.toString());
    throw new Error();
};
