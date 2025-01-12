import { BaseSolution, type Input } from '../solution';
import { product } from '../util/fp';
import { Grid } from '../util/grid';
import { Point2D } from '../util/point';
import { extractAllMatches } from '../util/regex';

type Guard = [Point2D, Point2D];

type Quadrant = 'NW' | 'NE' | 'SW' | 'SE';

const parseGuard = (line: string): Guard => {
    const [gx, gy, vx, vy] = extractAllMatches(line, /-?\d+/).map(Number);

    return [new Point2D(gx, gy), new Point2D(vx, vy)];
};

export class Solution extends BaseSolution {
    description = ``;

    // Example dimensions
    // width = 11;
    // height = 7;

    // Real dimensions
    width = 101;
    height = 103;

    tick([g, v]: Guard, ticks = 1): void {
        // handle wrapping
        g.x = (((g.x + v.x * ticks) % this.width) + this.width) % this.width;
        g.y = (((g.y + v.y * ticks) % this.height) + this.height) % this.height;
    }

    getQuadrant([g]: Guard): Quadrant | null {
        const horizontalMiddle = Math.floor(this.height / 2);
        const verticalMiddle = Math.floor(this.width / 2);

        if (g.y < horizontalMiddle) {
            // north
            if (g.x < verticalMiddle) {
                // west
                return 'NW';
            } else if (g.x > verticalMiddle) {
                // east
                return 'NE';
            }
        } else if (g.y > horizontalMiddle) {
            // south
            if (g.x < verticalMiddle) {
                // west
                return 'SW';
            } else if (g.x > verticalMiddle) {
                // east
                return 'SE';
            }
        }
        return null;
    }

    public solvePart1(lines: Input): string {
        const guards = lines.map(parseGuard);
        // console.log(guards);
        guards.forEach((g) => this.tick(g, 100));

        // console.log(guards);

        const quadrants = {
            NW: 0,
            NE: 0,
            SW: 0,
            SE: 0,
        };

        guards.forEach((g) => {
            const quad = this.getQuadrant(g);
            if (quad) {
                quadrants[quad]++;
            }
        });

        // console.log(quadrants);

        // const grid = new Grid<string>(this.width, this.height, '.');
        // guards.forEach(([g]) => grid.set(g, '#'));
        // console.log(grid.toString());

        return product(Object.values(quadrants)).toString();
    }

    public solvePart2(lines: Input): string {
        // wtf

        const guards = lines.map(parseGuard);
        // console.log(guards);

        const grid = new Grid<string>(this.width, this.height, '.');

        for (let i = 1; i < 10000; i++) {
            // tick every guard by 1
            guards.forEach((g) => this.tick(g, 1));

            // render the grid state
            grid.grid.fill('.');
            guards.forEach(([g]) => grid.set(g, '#'));

            // stupid hack: if the grid contains a straight line of guards, it must be an xmas tree
            if (grid.toString().includes('###########')) {
                // console.log('found it');

                // console.log(grid.toString());

                return i.toString();
            }
            // otherwise continue
        }

        throw new Error('no solution found');
    }
}
