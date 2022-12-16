import { BaseSolution } from '../solution';
import { Input } from '../types';
import { Grid, Point, translatePoint, Vector2D } from '../util/grid';

export class Solution extends BaseSolution {
    description = `
    --- Day 14: Regolith Reservoir ---
    The distress signal leads you to a giant waterfall! Actually, hang on - the signal seems like it's coming from the waterfall itself, and that doesn't make any sense. However, you do notice a little path that leads behind the waterfall.
    
    Correction: the distress signal leads you behind a giant waterfall! There seems to be a large cave system here, and the signal definitely leads further inside.
    
    As you begin to make your way deeper underground, you feel the ground rumble for a moment. Sand begins pouring into the cave! If you don't quickly figure out where the sand is going, you could quickly become trapped!
    
    Fortunately, your familiarity with analyzing the path of falling material will come in handy here. You scan a two-dimensional vertical slice of the cave above you (your puzzle input) and discover that it is mostly air with structures made of rock.
    
    Your scan traces the path of each solid rock structure and reports the x,y coordinates that form the shape of the path, where x represents distance to the right and y represents distance down. Each path appears as a single line of text in your scan. After the first point of each path, each point indicates the end of a straight horizontal or vertical line to be drawn from the previous point. For example:
    
    498,4 -> 498,6 -> 496,6
    503,4 -> 502,4 -> 502,9 -> 494,9
    This scan means that there are two paths of rock; the first path consists of two straight lines, and the second path consists of three straight lines. (Specifically, the first path consists of a line of rock from 498,4 through 498,6 and another line of rock from 498,6 through 496,6.)
    
    The sand is pouring into the cave from point 500,0.
    
    Drawing rock as #, air as ., and the source of the sand as +, this becomes:
    
    
      4     5  5
      9     0  0
      4     0  3
    0 ......+...
    1 ..........
    2 ..........
    3 ..........
    4 ....#...##
    5 ....#...#.
    6 ..###...#.
    7 ........#.
    8 ........#.
    9 #########.
    Sand is produced one unit at a time, and the next unit of sand is not produced until the previous unit of sand comes to rest. A unit of sand is large enough to fill one tile of air in your scan.
    
    A unit of sand always falls down one step if possible. If the tile immediately below is blocked (by rock or sand), the unit of sand attempts to instead move diagonally one step down and to the left. If that tile is blocked, the unit of sand attempts to instead move diagonally one step down and to the right. Sand keeps moving as long as it is able to do so, at each step trying to move down, then down-left, then down-right. If all three possible destinations are blocked, the unit of sand comes to rest and no longer moves, at which point the next unit of sand is created back at the source.
    
    So, drawing sand that has come to rest as o, the first unit of sand simply falls straight down and then stops:
    
    ......+...
    ..........
    ..........
    ..........
    ....#...##
    ....#...#.
    ..###...#.
    ........#.
    ......o.#.
    #########.
    The second unit of sand then falls straight down, lands on the first one, and then comes to rest to its left:
    
    ......+...
    ..........
    ..........
    ..........
    ....#...##
    ....#...#.
    ..###...#.
    ........#.
    .....oo.#.
    #########.
    After a total of five units of sand have come to rest, they form this pattern:
    
    ......+...
    ..........
    ..........
    ..........
    ....#...##
    ....#...#.
    ..###...#.
    ......o.#.
    ....oooo#.
    #########.
    After a total of 22 units of sand:
    
    ......+...
    ..........
    ......o...
    .....ooo..
    ....#ooo##
    ....#ooo#.
    ..###ooo#.
    ....oooo#.
    ...ooooo#.
    #########.
    Finally, only two more units of sand can possibly come to rest:
    
    ......+...
    ..........
    ......o...
    .....ooo..
    ....#ooo##
    ...o#ooo#.
    ..###ooo#.
    ....oooo#.
    .o.ooooo#.
    #########.
    Once all 24 units of sand shown above have come to rest, all further sand flows out the bottom, falling into the endless void. Just for fun, the path any new sand takes before falling forever is shown here with ~:
    
    .......+...
    .......~...
    ......~o...
    .....~ooo..
    ....~#ooo##
    ...~o#ooo#.
    ..~###ooo#.
    ..~..oooo#.
    .~o.ooooo#.
    ~#########.
    ~..........
    ~..........
    ~..........
    Using your scan, simulate the falling sand. How many units of sand come to rest before sand starts flowing into the abyss below?

    --- Part Two ---
    You realize you misread the scan. There isn't an endless void at the bottom of the scan - there's floor, and you're standing on it!
    
    You don't have time to scan the floor, so assume the floor is an infinite horizontal line with a y coordinate equal to two plus the highest y coordinate of any point in your scan.
    
    In the example above, the highest y coordinate of any point is 9, and so the floor is at y=11. (This is as if your scan contained one extra rock path like -infinity,11 -> infinity,11.) With the added floor, the example above now looks like this:
    
            ...........+........
            ....................
            ....................
            ....................
            .........#...##.....
            .........#...#......
            .......###...#......
            .............#......
            .............#......
            .....#########......
            ....................
    <-- etc #################### etc -->
    To find somewhere safe to stand, you'll need to simulate falling sand until a unit of sand comes to rest at 500,0, blocking the source entirely and stopping the flow of sand into the cave. In the example above, the situation finally looks like this after 93 units of sand come to rest:
    
    ............o............
    ...........ooo...........
    ..........ooooo..........
    .........ooooooo.........
    ........oo#ooo##o........
    .......ooo#ooo#ooo.......
    ......oo###ooo#oooo......
    .....oooo.oooo#ooooo.....
    ....oooooooooo#oooooo....
    ...ooo#########ooooooo...
    ..ooooo.......ooooooooo..
    #########################
    Using your scan, simulate the falling sand until the source of the sand becomes blocked. How many units of sand come to rest?
    `;

    public solvePart1(lines: Input): string {
        const sim = new SandSim(lines, [500, 0], false);
        sim.dropUntilFinished();
        // console.log(sim.toString());

        return sim.sandCount.toString();
    }

    public solvePart2(lines: Input): string {
        const sim = new SandSim(lines, [500, 0], true);

        sim.dropUntilFinished();
        // console.log(sim.toString());
        return sim.sandCount.toString();
    }
}

class SandSim {
    private grid: Grid<string>;
    private sandSource: Point;
    public sandCount = 0;

    constructor(inputLines: Input, sandSource: Point, hasFloor: boolean) {
        // used to reduce the size of the simulated area to only the interesting stuff
        let [minX, minY]: Point = [Infinity, Infinity];
        let [maxX, maxY]: Point = [0, 0];

        const pointArrays: Point[][] = inputLines.map((line) =>
            line.split(' -> ').map((pointStr) => {
                const [x, y] = pointStr.split(',').map((pointDim) => parseInt(pointDim)) as Point;
                minX = Math.min(x, minX);
                maxX = Math.max(x, maxX);
                minY = Math.min(y, minY);
                maxY = Math.max(y, maxY);
                return [x, y];
            })
        );

        // clamp the bounds of the grid to the horizontal points that we saw in the input
        let gridHeight = maxY + 1;
        if (hasFloor) gridHeight += 2;
        const gridWidth = maxX - minX + 1 + 2 * gridHeight;
        this.grid = new Grid(gridWidth, gridHeight, '.');

        const transformX = (x: number): number => x - minX + gridHeight;
        this.sandSource = [transformX(sandSource[0]), sandSource[1]];

        // console.log(gridHeight);

        //  extend the grid horizontally to at least `height` units wide (maybe height * 2 units) to account for grains piling up on the sides

        // draw lines
        pointArrays.forEach((linePoints) => {
            // console.log(linePoints);
            linePoints.slice(1).reduce((prevPoint, curPoint) => {
                // console.log(`drawing from ${prevPoint} -> ${curPoint}`);
                for (const [x, y] of this.grid.cardinalDirectionLineGenerator(
                    prevPoint,
                    curPoint
                )) {
                    this.grid.set([transformX(x), y], '#');
                    // console.log(`drawing point at ${point}`);
                }
                return curPoint;
            }, linePoints[0]);
        });

        if (hasFloor) {
            // draw line for floor
            const floorY = this.grid.height - 1;
            for (const p of this.grid.cardinalDirectionLineGenerator(
                [0, floorY],
                [this.grid.width - 1, floorY]
            )) {
                // console.log(p);
                this.grid.set(p, '#');
            }
        }

        this.grid.set(this.sandSource, '+');
    }

    isBlocked(p: Point) {
        return ['#', 'o'].includes(this.grid.getValue(p));
    }

    dropSand() {
        let currentPosition = this.sandSource;

        while (true) {
            // find the first transform that moves the sand to a non blocked point
            const nextPosition = Object.values(TRANSFORMS)
                .map((transform) => translatePoint([...currentPosition], transform))
                .find((candidatePoint) => {
                    if (!this.grid.isInBounds(candidatePoint)) {
                        throw new Error('Sand fell OOB');
                    }
                    return !this.isBlocked(candidatePoint);
                });

            if (nextPosition) {
                currentPosition = nextPosition;
            } else {
                // sand has come to rest
                this.grid.set(currentPosition, 'o');
                this.sandCount += 1;

                if (
                    currentPosition[0] === this.sandSource[0] &&
                    currentPosition[1] === this.sandSource[1]
                ) {
                    // sand has blocked the spawn
                    throw new Error('Sand is blocking the spawn');
                }
                return;
            }
        }
    }

    dropUntilFinished() {
        try {
            while (true) {
                this.dropSand();
            }
        } catch (e) {
            // console.log(`Stopped ${this.sandCount} grains: ${e.message}`);
        }
    }

    toString() {
        return `tick=${this.sandCount}\n${this.grid.toString()}`;
    }
}

type FallDirection = 'down' | 'downLeft' | 'downRight';
const TRANSFORMS: Record<FallDirection, Vector2D> = {
    down: [0, 1],
    downLeft: [-1, 1],
    downRight: [1, 1],
};
