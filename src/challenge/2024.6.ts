import { BaseSolution } from '../solution';
import { Input } from '../types';
import {
    CARDINAL_VECTORS,
    CardinalDirection,
    Grid,
    isPointEqual,
    Point,
    rotateDirection,
    translatePoint,
} from '../util/grid';

type Tile = '#' | '.';

export class Solution extends BaseSolution {
    description = ``;

    public solvePart1(lines: Input): string {
        let guardPosition: Point = [0, 0];
        let guardDirection: CardinalDirection = 'N';

        const visitedCells = new Set<string>();
        const visit = (pt: Point) => {
            // console.log(`visited ${pt}`);
            visitedCells.add(pt.join(','));
        };

        const grid = Grid.loadFromStrings<Tile>(lines, (char, pt) => {
            if (char === '^') {
                guardPosition = pt;
                visit(pt);
                return '.';
            } else if (char === '#' || char === '.') {
                return char;
            } else {
                throw new Error(char);
            }
        });

        while (grid.isInBounds(guardPosition)) {
            const newPosition = translatePoint(
                [...guardPosition],
                CARDINAL_VECTORS[guardDirection],
                1
            );
            if (grid.isInBounds(newPosition)) {
                if (grid.getValue(newPosition) === '.') {
                    // can move
                    visit(newPosition);
                    guardPosition = newPosition;
                } else if (grid.getValue(newPosition) === '#') {
                    // hit wall, rotate 90 degrees right
                    guardDirection = rotateDirection(guardDirection, 'CW');
                    // console.log(`hit wall at ${newPosition}!`, guardPosition, guardDirection);
                }
            } else {
                break;
            }
        }

        return visitedCells.size.toString();
    }

    public solvePart2(lines: Input): string {
        let initialGuardPosition: Point = [0, 0];
        const initialGuardDirection: CardinalDirection = 'N';

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

        const initialGrid = Grid.loadFromStrings<Tile>(lines, (char, pt) => {
            if (char === '^') {
                initialGuardPosition = pt;
                // visit(pt, initialGuardPosition);
                return '.';
            } else if (char === '#' || char === '.') {
                return char;
            } else {
                throw new Error(char);
            }
        });

        // try all possibilities

        let loops = 0;

        for (const obstaclePoint of initialGrid.pointGenerator()) {
            // Don't consider points that already have walls or are the initial guard position
            if (
                initialGrid.getValue(obstaclePoint) === '.' &&
                !isPointEqual(initialGuardPosition, obstaclePoint)
            ) {
                // set up a new Grid
                const thisGrid = Grid.loadFromStrings<Tile>(lines, (char) =>
                    char === '^' ? '.' : (char as Tile)
                );

                // populate an obstacle
                thisGrid.set(obstaclePoint, '#');

                let pos: Point = [...initialGuardPosition];
                let dir: CardinalDirection = initialGuardDirection;
                const set = new Set<string>();

                // console.log('setting obstacle at ', obstaclePoint);

                while (thisGrid.isInBounds(pos)) {
                    // console.log('here', pos, dir);
                    const newPosition = translatePoint([...pos], CARDINAL_VECTORS[dir], 1);
                    if (thisGrid.isInBounds(newPosition)) {
                        if (thisGrid.getValue(newPosition) === '.') {
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
                        } else if (thisGrid.getValue(newPosition) === '#') {
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

                // console.log('finished');
            }
        }

        return loops.toString();
    }
}
