import { BaseSolution } from '../solution';
import { Input } from '../types';
import { CARDINAL_VECTORS, Grid, Point, translatePoint } from '../util/grid';

export class Solution extends BaseSolution {
    description = ``;

    public solvePart1(lines: Input): string {
        const grid = Grid.loadFromStrings<string>(lines);

        let occurrences = 0;

        const search = 'XMAS';

        // visit every point and search in all eight cardinal directions
        for (const originPoint of grid.pointGenerator()) {
            occurrences += Object.entries(CARDINAL_VECTORS)
                .map(([direction, slope]) => {
                    const str = [...grid.linePointGenerator(slope, originPoint)]
                        .slice(0, 4)
                        .map((point) => grid.getValue(point))
                        .join('');

                    return str;
                })
                .filter((s) => s === search).length;
        }

        return occurrences.toString();
    }

    public solvePart2(lines: Input): string {
        const grid = Grid.loadFromStrings<string>(lines);

        let occurrences = 0;

        const search = 'MAS';
        const searchReverse = [...search].reverse().join('');

        // visit every point and search in an X pattern
        for (const originPoint of grid.pointGenerator()) {
            // get three chars starting from NW and going SE

            const [x, y] = originPoint;
            const nw: Point = [x - 1, y - 1];
            const ne: Point = [x + 1, y - 1];

            const str1 = [...grid.linePointGenerator(CARDINAL_VECTORS.SE, nw)]
                .slice(0, 3)
                .map((p) => grid.getValue(p))
                .join('');

            const str2 = [...grid.linePointGenerator(CARDINAL_VECTORS.SW, ne)]
                .slice(0, 3)
                .map((p) => grid.getValue(p))
                .join('');

            if (
                (str1 === search || str1 === searchReverse) &&
                (str2 === search || str2 === searchReverse)
            ) {
                occurrences += 1;
            }
        }

        return occurrences.toString();
    }
}
