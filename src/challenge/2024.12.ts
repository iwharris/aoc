import { BaseSolution, type Input } from '../solution';
import { sum } from '../util/fp';
import { Grid } from '../util/grid';
import { Point2D } from '../util/point';
import { StringifiedSet } from '../util/set';

const getRegions = (grid: Grid<string>): Record<number, StringifiedSet<Point2D>> => {
    const visited = new StringifiedSet<Point2D>([], Point2D.fromString);
    const regions: Record<number, StringifiedSet<Point2D>> = {};
    let regionId = 0;
    for (const pt of grid.pointGenerator()) {
        const p2d = Point2D.fromTuple(pt);
        if (!visited.has(p2d)) {
            // new region: flood fill it, register region, and mark cells as visited
            const regionCells = [...grid.floodFillGenerator(p2d, { includeDiagonal: false })];
            regionCells.forEach((p) => visited.add(p));
            regions[regionId] = new StringifiedSet(regionCells, Point2D.fromString);
            regionId++;
        }
    }

    return regions;
};

export class Solution extends BaseSolution {
    description = ``;

    public solvePart1(lines: Input): string {
        const grid = Grid.loadFromStrings<string>(lines);
        const regions = getRegions(grid);

        // Now we have regions - iterate through each and compute the price of each

        return sum(
            Object.values(regions).map((regionSet) => {
                // price is number of cells multiplied by edges to other regions or the boundary of the grid

                const borderLength = sum(
                    [...regionSet.values()].map((pt) => {
                        const cellValue = grid.getValue(pt);

                        // for each pt, get cardinal adjacent points and increment border by 1 if the edge is on a border
                        return sum(
                            [
                                ...grid.adjacentPointGenerator(pt, {
                                    orthogonalOnly: true,
                                    includeOutOfBoundsPoints: true,
                                }),
                            ].map((adjacentPoint) => {
                                if (!grid.isInBounds(adjacentPoint)) {
                                    return 1; // border
                                }
                                if (grid.getValue(adjacentPoint) !== cellValue) {
                                    return 1;
                                }

                                return 0;
                            })
                        );
                    })
                );
                return regionSet.size * borderLength;
            })
        ).toString();
    }

    public solvePart2(lines: Input): string {
        const grid = Grid.loadFromStrings<string>(lines);
        const regions = getRegions(grid);

        // Now we have regions - iterate through each and compute the price of each

        return sum(
            Object.values(regions).map((regionSet) => {
                // price is number of cells multiplied by edges to other regions or the boundary of the grid

                const cornerCount = sum(
                    [...regionSet.values()].map((pt) => {
                        const cellValue = grid.getValue(pt);

                        // for each pt, count number of corners that are on this point. the overall # of corners is the # of sides

                        const [x, y] = pt;
                        const [n, e, s, w, ne, se, sw, nw] = [
                            Point2D.fromTuple([x, y - 1]),
                            Point2D.fromTuple([x + 1, y]),
                            Point2D.fromTuple([x, y + 1]),
                            Point2D.fromTuple([x - 1, y]),

                            Point2D.fromTuple([x + 1, y - 1]),
                            Point2D.fromTuple([x + 1, y + 1]),
                            Point2D.fromTuple([x - 1, y + 1]),
                            Point2D.fromTuple([x - 1, y - 1]),
                        ];

                        const corners = [
                            [n, e, ne],
                            [s, e, se],
                            [s, w, sw],
                            [n, w, nw],
                        ];

                        const isInRegion = (pt: Point2D) => {
                            if (!grid.isInBounds(pt)) {
                                return false;
                            }
                            return grid.getValue(pt) === cellValue;
                        };

                        return sum(
                            corners.map((pts) => {
                                // is corner?
                                const [side1, side2, diag] = pts;
                                const isOutsideCorner = !isInRegion(side1) && !isInRegion(side2);
                                const isInsideCorner =
                                    isInRegion(side1) && isInRegion(side2) && !isInRegion(diag);

                                // console.log(pt, pts, isCorner);

                                return isOutsideCorner || isInsideCorner ? 1 : 0;
                            })
                        );
                    })
                );

                // console.log(regionSet.size, cornerCount);
                return regionSet.size * cornerCount;
            })
        ).toString();
    }
}
