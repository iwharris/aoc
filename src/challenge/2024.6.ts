import { BaseSolution } from '../solution';
import { Input } from '../types';
import {
    CARDINAL_VECTORS,
    CardinalDirection,
    Grid,
    Point,
    rotateDirection,
    translatePoint,
} from '../util/grid';

type GuardGrid = Grid<Tile>;
type Tile = '#' | '.';

const simulateVisitedCells = (
    grid: GuardGrid,
    initialGuardPosition: Point,
    initialGuardDirection: CardinalDirection
): Set<string> => {
    let pos = initialGuardPosition;
    let dir = initialGuardDirection;
    const visited = new Set<string>();
    const visit = (pt: Point) => visited.add(pt.join(','));

    visit(pos);

    while (grid.isInBounds(pos)) {
        const newPos = translatePoint([...pos], CARDINAL_VECTORS[dir], 1);
        if (grid.isInBounds(newPos)) {
            if (grid.getValue(newPos) === '.') {
                // can move
                visit(newPos);
                pos = newPos;
            } else if (grid.getValue(newPos) === '#') {
                // hit wall, rotate 90 degrees right
                dir = rotateDirection(dir, 'CW');
                // console.log(`hit wall at ${newPosition}!`, pos, guardDirection);
            }
        } else {
            break;
        }
    }

    return visited;
};

const parseGrid = (lines: Input): [GuardGrid, Point] => {
    let guardPos: Point | undefined;

    const grid = Grid.loadFromStrings<Tile>(lines, (char, pt) => {
        if (char === '^') {
            guardPos = pt;
            return '.';
        } else if (char === '#' || char === '.') {
            return char;
        } else {
            throw new Error(char);
        }
    });

    if (!guardPos) throw new Error();

    return [grid, guardPos];
};

export class Solution extends BaseSolution {
    description = ``;

    public solvePart1(lines: Input): string {
        const [grid, guardPosition] = parseGrid(lines);
        const guardDirection: CardinalDirection = 'N';

        const visited = simulateVisitedCells(grid, guardPosition, guardDirection);
        return visited.size.toString();
    }

    public solvePart2(lines: Input): string {
        const [grid, initialGuardPosition] = parseGrid(lines);
        const initialGuardDirection: CardinalDirection = 'N';

        const initialVisited = simulateVisitedCells(
            grid,
            initialGuardPosition,
            initialGuardDirection
        );

        // initialVisited now contains all the points where we can place an obstacle
        initialVisited.delete(initialGuardPosition.join(','));

        const visit = (set: Set<string>, pt: Point, dir: CardinalDirection): boolean => {
            // console.log(`visited ${pt}`);
            const key = [...pt, dir].join(',');
            if (set.has(key)) {
                // console.log('Found loop at ', key);
                return true;
            } else {
                // console.log('visited', key);
                set.add(key);
                return false;
            }
        };

        let loops = 0;

        for (const obstaclePoint of [...initialVisited.values()].map((s) =>
            s.split(',').map((num) => parseInt(num))
        )) {
            // populate an obstacle
            grid.set(obstaclePoint as Point, '#');

            let pos: Point = [...initialGuardPosition];
            let dir: CardinalDirection = initialGuardDirection;
            const set = new Set<string>();

            // console.log('setting obstacle at ', obstaclePoint);

            while (grid.isInBounds(pos)) {
                // console.log('here', pos, dir);
                const newPosition = translatePoint([...pos], CARDINAL_VECTORS[dir], 1);
                if (grid.isInBounds(newPosition)) {
                    if (grid.getValue(newPosition) === '.') {
                        // can move
                        const foundLoop = visit(set, newPosition, dir);
                        pos = newPosition;
                        if (foundLoop) {
                            // console.log(
                            //     'found loop while moving forward at ',
                            //     newPosition,
                            //     dir,
                            //     set
                            // );
                            loops += 1;
                            break;
                        }
                    } else if (grid.getValue(newPosition) === '#') {
                        // hit wall, rotate 90 degrees right
                        dir = rotateDirection(dir, 'CW');
                        const foundLoop = visit(set, pos, dir);
                        if (foundLoop) {
                            // console.log('found loop while rotating at ', newPosition, dir, set);
                            loops += 1;
                            break;
                        }
                        // console.log(`hit wall at ${newPosition}!`, pos, dir);
                    }
                } else {
                    // console.log('ran off edge at', pos, dir);
                    break;
                }
            }

            // Clean up obstacle
            grid.set(obstaclePoint as Point, '.');

            // console.log('finished');
        }

        return loops.toString();
    }
}
