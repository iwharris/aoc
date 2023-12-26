import { BaseSolution } from '../solution';
import { Input } from '../types';
import { CARDINAL_VECTORS, CardinalDirection, Grid, Point, translatePoint } from '../util/grid';

export class Solution extends BaseSolution {
    description = ``;

    public solvePart1(lines: Input): string {
        const g = new RaytraceGrid(lines);
        return g.part1().toString();
    }

    public solvePart2(lines: Input): string {
        const g = new RaytraceGrid(lines);
        return g.part2().toString();
    }
}

type GridCell = '.' | '|' | '-' | '\\' | '/';

class RaytraceGrid {
    private grid: Grid<GridCell>;
    private visited: Grid<boolean>;
    private queue: [Point, CardinalDirection][] = [];
    private memo: Set<string> = new Set();

    constructor(lines: Input) {
        this.grid = Grid.loadFromStrings(lines);
        this.visited = new Grid<boolean>(this.grid.width, this.grid.height, false);
    }

    private raytraceLine(origin: Point, direction: CardinalDirection): void {
        // Don't infinitely loop
        if (this.memo.has(`${origin},${direction}`)) return;

        // console.log(origin, direction, this.memo);

        for (const p of this.grid.linePointGenerator(CARDINAL_VECTORS[direction], origin)) {
            this.visited.set(p, true);
            const cell = this.grid.getValue(p);
            if ('/\\'.includes(cell)) {
                // bounce
                const newDir = (
                    {
                        'E/': 'N',
                        'W/': 'S',
                        'N/': 'E',
                        'S/': 'W',
                        'E\\': 'S',
                        'W\\': 'N',
                        'N\\': 'W',
                        'S\\': 'E',
                    } as Record<string, CardinalDirection>
                )[`${direction}${cell}`];

                if (!newDir) {
                    throw new Error(`no newDir for cell=${cell} when tracing ${direction}`);
                }

                this.queue.push([translatePoint(p, CARDINAL_VECTORS[newDir]), newDir]);

                break;
            } else if (cell === '|' && ['W', 'E'].includes(direction)) {
                for (const newDir of ['N', 'S'] as CardinalDirection[]) {
                    this.queue.push([translatePoint(p, CARDINAL_VECTORS[newDir]), newDir]);
                }
                break;
            } else if (cell === '-' && ['N', 'S'].includes(direction)) {
                for (const newDir of ['W', 'E'] as CardinalDirection[]) {
                    this.queue.push([translatePoint(p, CARDINAL_VECTORS[newDir]), newDir]);
                }
                break;
            }
        }

        this.memo.add(`${origin},${direction}`);
    }

    private raytrace(origin: Point, direction: CardinalDirection): number {
        this.visited.grid.fill(false);
        this.memo.clear();
        this.queue = [[origin, direction]];

        while (this.queue.length) {
            const elem = this.queue.shift();
            if (!elem) throw new Error('Could not pop an item off the queue');
            const [origin, direction] = elem;
            this.raytraceLine(origin, direction);
        }

        // console.log(this.visited.map((c) => (c ? '#' : '.')).toString());

        return this.visited.grid.filter(Boolean).length;
    }

    public part1(): number {
        return this.raytrace([0, 0], 'E');
    }

    public part2(): number {
        let mostEnergy = -Infinity;
        for (const startingPoint of this.grid.edgePointGenerator()) {
            const [startX, startY] = startingPoint;

            let direction: CardinalDirection;
            if (startX === 0) direction = 'E';
            else if (startX === this.grid.width - 1) direction = 'W';
            else if (startY === 0) direction = 'S';
            else direction = 'N';

            mostEnergy = Math.max(mostEnergy, this.raytrace(startingPoint, direction));
        }

        return mostEnergy;
    }
}
