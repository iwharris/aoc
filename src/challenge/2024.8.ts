import { BaseSolution } from '../solution';
import { Input } from '../types';
import { Grid, Point, Vector2D } from '../util/grid';

const getAllPairs = (points: Point[]): [Point, Point][] => {
    const pairs: [Point, Point][] = [];
    for (let i = 0; i < points.length - 1; i++) {
        for (let j = i + 1; j < points.length; j++) {
            pairs.push([[...points[i]] as Point, [...points[j]] as Point]);
        }
    }
    return pairs;
};

type NodeMap = Record<string, Point[]>;

const parseInput = (lines: Input): [Grid<string>, Grid<boolean>, NodeMap] => {
    const nodes: NodeMap = {};

    const grid = Grid.loadFromStrings<string>(lines, (char, pt) => {
        if (char !== '.') {
            // there is an antenna; add it to our mapping
            if (!nodes[char]) {
                nodes[char] = [];
            }
            nodes[char].push(pt);
        }
        return char;
    });

    const antinodeGrid = new Grid<boolean>(grid.width, grid.height, false);

    return [grid, antinodeGrid, nodes];
};

const plotAntinodes = (antinodeGrid: Grid<boolean>, nodes: NodeMap, isPart2: boolean): void => {
    for (const nodeType of Object.keys(nodes)) {
        // console.log('processing antenna', nodeType);

        getAllPairs(nodes[nodeType]).forEach(([a, b]) => {
            const slope: Vector2D = [a[0] - b[0], a[1] - b[1]];

            if (!isPart2) {
                // add slope to a, subtract slope from b
                const antinodes: Point[] = [
                    [a[0] + slope[0], a[1] + slope[1]],
                    [b[0] - slope[0], b[1] - slope[1]],
                ];

                antinodes.forEach((pt) => {
                    if (antinodeGrid.isInBounds(pt)) {
                        // console.log('setting antinode at', pt);
                        antinodeGrid.set(pt, true);
                    }
                });

                // console.log('processing pair', a, b, 'slope is', slope, 'antinodes are', antinodes);
            } else {
                // part 2: plot nodes all along slope
                // first plot from first point (doesn't matter)
                for (const pt of antinodeGrid.linePointGenerator(slope, a)) {
                    antinodeGrid.set(pt, true);
                }
                // and reverse the slope to project in the other direction from a
                for (const pt of antinodeGrid.linePointGenerator(
                    [-slope[0], -slope[1]] as Vector2D,
                    a
                )) {
                    antinodeGrid.set(pt, true);
                }
            }
        });

        // console.log(nodePairs);
    }
};

export class Solution extends BaseSolution {
    description = ``;

    public solvePart1(lines: Input): string {
        const [grid, antinodeGrid, nodes] = parseInput(lines);

        plotAntinodes(antinodeGrid, nodes, false);

        return [...antinodeGrid.pointGenerator()]
            .map((pt) => antinodeGrid.getValue(pt))
            .filter(Boolean)
            .length.toString();
    }

    public solvePart2(lines: Input): string {
        const [grid, antinodeGrid, nodes] = parseInput(lines);

        plotAntinodes(antinodeGrid, nodes, true);

        // console.log(antinodeGrid.map((v) => (v ? '#' : '.')).toString());

        return [...antinodeGrid.pointGenerator()]
            .map((pt) => antinodeGrid.getValue(pt))
            .filter(Boolean)
            .length.toString();
    }
}
