import { BaseSolution } from '../solution';
import { Input } from '../types';
import { max } from '../util/fp';
import { Grid, Point, Vector2D, isEqual, translatePoint } from '../util/grid';

export class Solution extends BaseSolution {
    description = `

    `;

    public solvePart1(lines: Input): string {
        const pipes: Grid = Grid.loadFromStrings(lines);
        const startingPoint = pipes.getPointFromIndex(pipes.indexOf('S') ?? -1);
        const distances: Record<string, number> = {
            [startingPoint.toString()]: 0,
        };

        const visit = (
            from: Point,
            pipeLocation: Point,
            distanceTravelled: number
        ): Point | null => {
            const pipeType = pipes.getValue(pipeLocation);
            const pipeLocationStr = pipeLocation.toString();

            if (!PIPES[pipeType]) {
                return null;
            }

            const connections = PIPES[pipeType].map((offset) =>
                translatePoint([pipeLocation[0], pipeLocation[1]], offset)
            );
            // connections has two points on the grid. one should be the 'from' point. Other is the destination that we will visit next

            // console.log(connections);

            if (!connections.find((p) => isEqual(p, from))) {
                console.warn(
                    `Pipe ${pipeType} (${pipeLocation}) does not connect to ${from}. Bailing out...`
                );
                return null;
            }

            const destination = connections.find((p) => !isEqual(p, from));
            if (!destination) throw Error('did not find dest somehow');

            const currentDistance = distanceTravelled + 1;
            const existingDistance = distances[pipeLocationStr];
            if (Number.isInteger(existingDistance) && currentDistance >= existingDistance) {
                // A previous visit has made it here in a smaller distance. Bail out without continuing
                return null;
            } else {
                // We've found a shorter path to this pipe. Replace the distance and continue
                distances[pipeLocationStr] = currentDistance;
                return destination;
            }
        };

        for (const start of [
            ...pipes.adjacentPointGenerator(startingPoint, { orthogonalOnly: true }),
        ]) {
            let current: Point = [startingPoint[0], startingPoint[1]];
            let next: Point | null = start;
            let distance = 0;
            while (next) {
                const destination = visit(current, next, distance);
                current = next;
                next = destination;
                distance += 1;
            }
        }

        return max(Object.values(distances))?.toString() ?? 'Not found';
    }

    public solvePart2(lines: Input): string {
        const pipes: Grid = Grid.loadFromStrings(lines);
        const startingPoint = pipes.getPointFromIndex(pipes.indexOf('S') ?? -1);
        const visited = new Grid<' ' | 'P' | 'I' | 'O'>(pipes.width, pipes.height, ' ');
        const distances: Record<string, number> = {
            [startingPoint.toString()]: 0,
        };

        const visit = (
            from: Point,
            pipeLocation: Point,
            distanceTravelled: number
        ): Point | null => {
            const pipeType = pipes.getValue(pipeLocation);
            const pipeLocationStr = pipeLocation.toString();

            if (!PIPES[pipeType]) {
                return null;
            }

            const connections = PIPES[pipeType].map((offset) =>
                translatePoint([pipeLocation[0], pipeLocation[1]], offset)
            );
            // connections has two points on the grid. one should be the 'from' point. Other is the destination that we will visit next

            // console.log(connections);

            if (!connections.find((p) => isEqual(p, from))) {
                console.warn(
                    `Pipe ${pipeType} (${pipeLocation}) does not connect to ${from}. Bailing out...`
                );
                return null;
            }

            const destination = connections.find((p) => !isEqual(p, from));
            if (!destination) throw Error('did not find dest somehow');

            const currentDistance = distanceTravelled + 1;
            const existingDistance = distances[pipeLocationStr];
            if (Number.isInteger(existingDistance) && currentDistance >= existingDistance) {
                // A previous visit has made it here in a smaller distance. Bail out without continuing
                return null;
            } else {
                // We've found a shorter path to this pipe. Replace the distance and continue
                distances[pipeLocationStr] = currentDistance;
                return destination;
            }
        };

        for (const start of [
            ...pipes.adjacentPointGenerator(startingPoint, { orthogonalOnly: true }),
        ]) {
            let current: Point = [startingPoint[0], startingPoint[1]];
            let next: Point | null = start;
            let distance = 0;
            while (next) {
                const destination = visit(current, next, distance);
                visited.set(current, 'P');
                current = next;
                next = destination;
                distance += 1;
            }
        }

        // const floodFill = (currentPoint: Point): void => {
        //     if (visited.isInBounds(currentPoint) && visited.getValue(currentPoint) === ' ') {
        //         // console.log('flood');
        //         // Mark this point visited
        //         visited.set(currentPoint, '.');

        //         // Keep flooding
        //         for (const adjPoint of visited.adjacentPointGenerator(currentPoint, {
        //             orthogonalOnly: true,
        //         })) {
        //             floodFill(adjPoint);
        //         }
        //     }
        // };

        let insideCount = 0;

        visited.forEach((val, idx) => {
            if (val !== 'P') {
                pipes.set(pipes.getPointFromIndex(idx), ' ');
                // Winding rule: check all pipe sections to the left of this one and check if there are an odd number of |JLS
                const pt = visited.getPointFromIndex(idx);
                let numTurns = 0;
                for (const leftPt of visited.linePointGenerator([-1, 0], pt)) {
                    if (['|', 'F', '7'].includes(pipes.getValue(leftPt))) numTurns += 1;
                }
                const isOdd = numTurns % 2 === 1;
                // if odd, this coordinate must be in the loop
                visited.set(pt, isOdd ? 'I' : 'O');
                if (isOdd) insideCount += 1;
            }
        }, visited);

        // Flood grid with F's
        // floodFill([0, 0]);

        const charMap = {
            '-': '─',
            '|': '│',
            7: '┐',
            F: '┌',
            L: '└',
            J: '┘',
        };
        pipes.forEach((char, i) => {
            if (charMap[char]) {
                pipes.set(pipes.getPointFromIndex(i), charMap[char]);
            }
        }, pipes);

        // console.log(pipes.toString());

        // console.log(visited.toString());
        return insideCount.toString();
    }
}

const PIPES: Record<string, Vector2D[]> = {
    '|': [
        [0, -1],
        [0, 1],
    ],
    '-': [
        [-1, 0],
        [1, 0],
    ],
    L: [
        [0, -1],
        [1, 0],
    ],
    J: [
        [0, -1],
        [-1, 0],
    ],
    7: [
        [-1, 0],
        [0, 1],
    ],
    F: [
        [0, 1],
        [1, 0],
    ],
};
