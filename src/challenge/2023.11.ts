import { BaseSolution } from '../solution';
import { Input } from '../types';
import { sum } from '../util/fp';
import { Grid } from '../util/grid';
import { translatePoint } from '../util/point';
import { Point } from '../util/point';
import { manhattanDistance } from '../util/point';

export class Solution extends BaseSolution {
    description = `

    `;

    public solvePart1(lines: Input): string {
        const pairs = parsePairsFromGalaxy(lines, 1);

        return sum(pairs.map(([a, b]) => manhattanDistance(a, b))).toString();
    }

    public solvePart2(lines: Input): string {
        const pairs = parsePairsFromGalaxy(lines, 1000000 - 1);

        return sum(pairs.map(([a, b]) => manhattanDistance(a, b))).toString();
    }
}

type Cell = '#' | '.';

const parsePairsFromGalaxy = (lines: Input, expansionFactor: number): [Point, Point][] => {
    const originalGrid: Grid<Cell> = Grid.loadFromStrings(lines);

    // count empty rows and columns
    const emptyColumns: number[] = [];
    for (let column = 0; column < originalGrid.width; column++) {
        if (
            [...originalGrid.pointsInColumn(column)].every(
                (pt) => originalGrid.getValue(pt) === '.'
            )
        )
            emptyColumns.push(column);
    }
    const emptyRows: number[] = [];
    for (let row = 0; row < originalGrid.height; row++) {
        if ([...originalGrid.pointsInRow(row)].every((pt) => originalGrid.getValue(pt) === '.'))
            emptyRows.push(row);
    }

    const points: Point[] = [];
    originalGrid.forEach((cell, idx) => {
        if (cell === '#') {
            const originalPt = originalGrid.getPointFromIndex(idx);
            const newPt = translatePoint(originalPt, [
                emptyColumns.filter((c) => c < originalPt[0]).length * expansionFactor,
                emptyRows.filter((r) => r < originalPt[1]).length * expansionFactor,
            ]);
            points.push(newPt);
        }
    }, originalGrid);

    const pairs: [Point, Point][] = [];
    for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
            pairs.push([points[i], points[j]]);
        }
    }

    return pairs;
};
