import { BaseSolution } from '../solution';
import { Input } from '../types';
import {
    CARDINAL_VECTORS,
    CardinalDirection,
    Grid,
    isPointEqual,
    rotateDirection,
} from '../util/grid';
import { addPoints } from '../util/point';
import { Point } from '../util/point';
import { DeprecatedHeapPriorityQueue } from '../util/struct/priority-queue';

export class Solution extends BaseSolution {
    description = ``;

    public solvePart1(lines: Input): string {
        const g = Grid.loadFromStrings(lines).map((cell) => parseInt(cell));

        return solve(g, 0, 3).toString();
    }

    public solvePart2(lines: Input): string {
        const g = Grid.loadFromStrings(lines).map((cell) => parseInt(cell));

        return solve(g, 4, 10).toString();
    }
}

// Total heat (weight), current position, facing direction, num steps taken in this direction
type State = [number, Point, CardinalDirection, number];

const solve = (g: Grid<number>, minSteps: number, maxSteps: number): number => {
    // dijkstra implementation
    const queue = new DeprecatedHeapPriorityQueue<State>((a, b) => a[0] - b[0]);

    const source: Point = [0, 0];
    const target: Point = [g.width - 1, g.height - 1];

    // Initial options are to move east or south
    queue.push([0, source, 'E', 0]);
    queue.push([0, source, 'S', 0]);
    const seen = new Set<string>();

    while (queue.size > 0) {
        const item = queue.pop();
        if (!item) throw new Error();
        const [heat, point, direction, numSteps] = item;
        // console.log(
        //     `considering point [${point}] facing ${direction} with currentHeat=${heat} after taking ${numSteps} step(s) in this dir`
        // );

        if (isPointEqual(point, target)) {
            // console.warn(`FOUND IT at point ${point} with heat ${heat}`);
            return heat;
        }

        // compute unique identifier for this point+direction
        const id = `${point.toString()}:${direction}:${numSteps}`;
        if (seen.has(id)) {
            // We have visited this point before; don't traverse further
            continue;
        }
        seen.add(id); // track that we've seen this point+direction

        // Moves from here are either: turn left and move 1, turn right and move 1, or go straight 1
        for (const move of ['left', 'right', 'straight']) {
            if (['left', 'right'].includes(move)) {
                const newDirection = rotateDirection(direction, move === 'left' ? 'CCW' : 'CW');
                // console.log(`new dir of ${direction} -> ${move} is ${newDirection}`);
                const newPoint = addPoints(point, CARDINAL_VECTORS[newDirection]);
                if (numSteps >= minSteps && g.isInBounds(newPoint)) {
                    queue.push([heat + g.getValue(newPoint), newPoint, newDirection, 1]);
                }
            } else if (numSteps < maxSteps) {
                const newPoint = addPoints(point, CARDINAL_VECTORS[direction]);
                if (g.isInBounds(newPoint)) {
                    queue.push([heat + g.getValue(newPoint), newPoint, direction, numSteps + 1]);
                }
            }
        }
    }

    // console.log(seen);

    throw new Error('did not find a solution');
};
