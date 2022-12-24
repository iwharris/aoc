import { BaseSolution } from '../solution';
import { Input } from '../types';
import { Point } from '../util/grid';

export class Solution extends BaseSolution {
    description = `
    --- Day 22: Monkey Map ---
    The monkeys take you on a surprisingly easy trail through the jungle. They're even going in roughly the right direction according to your handheld device's Grove Positioning System.
    
    As you walk, the monkeys explain that the grove is protected by a force field. To pass through the force field, you have to enter a password; doing so involves tracing a specific path on a strangely-shaped board.
    
    At least, you're pretty sure that's what you have to do; the elephants aren't exactly fluent in monkey.
    
    The monkeys give you notes that they took when they last saw the password entered (your puzzle input).
    
    For example:
    
            ...#
            .#..
            #...
            ....
    ...#.......#
    ........#...
    ..#....#....
    ..........#.
            ...#....
            .....#..
            .#......
            ......#.
    
    10R5L5R10L4R5L5
    The first half of the monkeys' notes is a map of the board. It is comprised of a set of open tiles (on which you can move, drawn .) and solid walls (tiles which you cannot enter, drawn #).
    
    The second half is a description of the path you must follow. It consists of alternating numbers and letters:
    
    A number indicates the number of tiles to move in the direction you are facing. If you run into a wall, you stop moving forward and continue with the next instruction.
    A letter indicates whether to turn 90 degrees clockwise (R) or counterclockwise (L). Turning happens in-place; it does not change your current tile.
    So, a path like 10R5 means "go forward 10 tiles, then turn clockwise 90 degrees, then go forward 5 tiles".
    
    You begin the path in the leftmost open tile of the top row of tiles. Initially, you are facing to the right (from the perspective of how the map is drawn).
    
    If a movement instruction would take you off of the map, you wrap around to the other side of the board. In other words, if your next tile is off of the board, you should instead look in the direction opposite of your current facing as far as you can until you find the opposite edge of the board, then reappear there.
    
    For example, if you are at A and facing to the right, the tile in front of you is marked B; if you are at C and facing down, the tile in front of you is marked D:
    
            ...#
            .#..
            #...
            ....
    ...#.D.....#
    ........#...
    B.#....#...A
    .....C....#.
            ...#....
            .....#..
            .#......
            ......#.
    It is possible for the next tile (after wrapping around) to be a wall; this still counts as there being a wall in front of you, and so movement stops before you actually wrap to the other side of the board.
    
    By drawing the last facing you had with an arrow on each tile you visit, the full path taken by the above example looks like this:
    
            >>v#    
            .#v.    
            #.v.    
            ..v.    
    ...#...v..v#    
    >>>v...>#.>>    
    ..#v...#....    
    ...>>>>v..#.    
            ...#....
            .....#..
            .#......
            ......#.
    To finish providing the password to this strange input device, you need to determine numbers for your final row, column, and facing as your final position appears from the perspective of the original map. Rows start from 1 at the top and count downward; columns start from 1 at the left and count rightward. (In the above example, row 1, column 1 refers to the empty space with no tile on it in the top-left corner.) Facing is 0 for right (>), 1 for down (v), 2 for left (<), and 3 for up (^). The final password is the sum of 1000 times the row, 4 times the column, and the facing.
    
    In the above example, the final row is 6, the final column is 8, and the final facing is 0. So, the final password is 1000 * 6 + 4 * 8 + 0: 6032.
    
    Follow the path given in the monkeys' notes. What is the final password?
    
    --- Part Two ---
    As you reach the force field, you think you hear some Elves in the distance. Perhaps they've already arrived?
    
    You approach the strange input device, but it isn't quite what the monkeys drew in their notes. Instead, you are met with a large cube; each of its six faces is a square of 50x50 tiles.
    
    To be fair, the monkeys' map does have six 50x50 regions on it. If you were to carefully fold the map, you should be able to shape it into a cube!
    
    In the example above, the six (smaller, 4x4) faces of the cube are:
    
            1111
            1111
            1111
            1111
    222233334444
    222233334444
    222233334444
    222233334444
            55556666
            55556666
            55556666
            55556666
    You still start in the same position and with the same facing as before, but the wrapping rules are different. Now, if you would walk off the board, you instead proceed around the cube. From the perspective of the map, this can look a little strange. In the above example, if you are at A and move to the right, you would arrive at B facing down; if you are at C and move down, you would arrive at D facing up:
    
            ...#
            .#..
            #...
            ....
    ...#.......#
    ........#..A
    ..#....#....
    .D........#.
            ...#..B.
            .....#..
            .#......
            ..C...#.
    Walls still block your path, even if they are on a different face of the cube. If you are at E facing up, your movement is blocked by the wall marked by the arrow:
    
            ...#
            .#..
         -->#...
            ....
    ...#..E....#
    ........#...
    ..#....#....
    ..........#.
            ...#....
            .....#..
            .#......
            ......#.
    Using the same method of drawing the last facing you had with an arrow on each tile you visit, the full path taken by the above example now looks like this:
    
            >>v#    
            .#v.    
            #.v.    
            ..v.    
    ...#..^...v#    
    .>>>>>^.#.>>    
    .^#....#....    
    .^........#.    
            ...#..v.
            .....#v.
            .#v<<<<.
            ..v...#.
    The final password is still calculated from your final position and facing from the perspective of the map. In this example, the final row is 5, the final column is 7, and the final facing is 3, so the final password is 1000 * 5 + 4 * 7 + 3 = 5031.
    
    Fold the map into a cube, then follow the path given in the monkeys' notes. What is the final password?
    `;

    // preserveEmptyLines = true;
    preserveWhitespace = true;

    public solvePart1(lines: Input): string {
        // return solve(lines, wrapForExamplePart1).toString();
        return solve(lines, wrapForPart1).toString();
    }

    public solvePart2(lines: Input): string {
        return solve(lines, wrapForPart2).toString();
    }
}

const SIDE_LENGTH = 50; // for real input
// const SIDE_LENGTH = 4; // for example input

type CellValue = '#' | '.';
type Grid = Record<string, CellValue>;

const solve = (lines: Input, wrapCallback: typeof wrapForExamplePart1): number => {
    const gridLines = lines.slice(0, lines.length - 1);

    let pos: Point = [[...gridLines[0]].findIndex((v) => v === '.'), 0];
    let dir: Direction = EAST;

    const grid: Grid = {};

    for (const [y, line] of Object.entries(gridLines)) {
        for (const [x, cell] of Object.entries(line)) {
            if (['#', '.'].includes(cell)) grid[[x, y].toString()] = cell as CellValue;
        }
    }

    // console.log(grid);

    const moves: Move[] =
        [...lines[lines.length - 1].matchAll(/\d+|[RL]/gm)].map(([m]) =>
            ['R', 'L'].includes(m) ? (m as Rotation) : Number(m)
        ) ?? [];

    // console.log(moves);

    for (const move of moves) {
        if (move === 'L' || move === 'R') {
            const newDir = rotate(dir, move);
            // console.log(`facing ${dir}, rotating ${move}, new direction is ${newDir}`);
            dir = newDir;
        } else {
            for (let i = 0; i < move; i++) {
                let newPos: Point = [pos[0] + TRANSLATIONS[dir][0], pos[1] + TRANSLATIONS[dir][1]];
                let newDir: Direction = dir;
                if (!grid[newPos.toString()]) {
                    // console.log(`need to wrap at position ${newPos.toString()}`);
                    const [p, d] = wrapCallback(newPos, newDir);
                    // console.log(
                    //     `wrapped: ${newPos.toString()} -> ${p.toString()}, ${newDir} -> ${d}`
                    // );
                    newPos = p;
                    newDir = d;
                }
                if (grid[newPos.toString()] === '.') {
                    pos = newPos;
                    dir = newDir;
                }
                // console.log(`new pos is ${newPos.toString()}`);
            }
        }
    }

    return 1000 * (pos[1] + 1) + 4 * (pos[0] + 1) + dir;
};

const wrapForExamplePart1 = ([x, y]: Point, d: Direction): [Point, Direction] => {
    switch (d) {
        case WEST: {
            switch (floorDiv(y, SIDE_LENGTH)) {
                case 0:
                    return [[3 * SIDE_LENGTH - 1, y], d];
                case 1:
                    return [[3 * (SIDE_LENGTH - 1), y], d];
                case 2:
                    return [[4 * SIDE_LENGTH - 1, y], d];
            }
            break;
        }
        case EAST: {
            switch (floorDiv(y, SIDE_LENGTH)) {
                case 0:
                    return [[2 * SIDE_LENGTH, y], d];
                case 1:
                    return [[0 * SIDE_LENGTH, y], d];
                case 2:
                    return [[2 * SIDE_LENGTH, y], d];
            }
            break;
        }
        case NORTH: {
            switch (floorDiv(x, SIDE_LENGTH)) {
                case 0:
                    return [[x, 2 * SIDE_LENGTH - 1], d];
                case 1:
                    return [[x, 2 * SIDE_LENGTH - 1], d];
                case 2:
                    return [[x, 3 * SIDE_LENGTH - 1], d];
                case 3:
                    return [[x, 3 * SIDE_LENGTH - 1], d];
            }
            break;
        }
        case SOUTH: {
            switch (floorDiv(x, SIDE_LENGTH)) {
                case 0:
                    return [[x, 1 * SIDE_LENGTH], d];
                case 1:
                    return [[x, 1 * SIDE_LENGTH], d];
                case 2:
                    return [[x, 0 * SIDE_LENGTH], d];
                case 3:
                    return [[x, 2 * SIDE_LENGTH], d];
            }
            break;
        }
    }
    throw new Error(`unhandled case: pos=${x},${y} dir=${d}`);
};

const wrapForPart1: typeof wrapForExamplePart1 = ([x, y], d) => {
    switch (d) {
        case WEST: {
            switch (floorDiv(y, SIDE_LENGTH)) {
                case 0:
                    return [[3 * SIDE_LENGTH - 1, y], d];
                case 1:
                    return [[2 * SIDE_LENGTH - 1, y], d];
                case 2:
                    return [[2 * SIDE_LENGTH - 1, y], d];
                case 3:
                    return [[1 * SIDE_LENGTH - 1, y], d];
            }
            break;
        }
        case EAST: {
            switch (floorDiv(y, SIDE_LENGTH)) {
                case 0:
                    return [[1 * SIDE_LENGTH, y], d];
                case 1:
                    return [[1 * SIDE_LENGTH, y], d];
                case 2:
                    return [[0 * SIDE_LENGTH, y], d];
                case 3:
                    return [[0 * SIDE_LENGTH, y], d];
            }
            break;
        }
        case NORTH: {
            switch (floorDiv(x, SIDE_LENGTH)) {
                case 0:
                    return [[x, 4 * SIDE_LENGTH - 1], d];
                case 1:
                    return [[x, 3 * SIDE_LENGTH - 1], d];
                case 2:
                    return [[x, 1 * SIDE_LENGTH - 1], d];
            }
            break;
        }
        case SOUTH: {
            switch (floorDiv(x, SIDE_LENGTH)) {
                case 0:
                    return [[x, 2 * SIDE_LENGTH], d];
                case 1:
                    return [[x, 0 * SIDE_LENGTH], d];
                case 2:
                    return [[x, 0 * SIDE_LENGTH], d];
            }
            break;
        }
    }
    throw new Error(`unhandled case: pos=${x},${y} dir=${d}`);
};

const wrapForPart2: typeof wrapForExamplePart1 = ([x, y], d) => {
    switch (d) {
        /*
        Layout:

          A B
          C
        E D
        F
        */
        case WEST: {
            switch (floorDiv(y, SIDE_LENGTH)) {
                case 0:
                    // Ends up on the left side of cell E facing EAST (inverted)
                    return [[0, 149 - y], EAST];
                case 1:
                    // End up on the top of E facing SOUTH
                    return [[y - 50, 100], SOUTH];
                case 2:
                    // End up on the left side of A facing EAST (inverted)
                    return [[50, 149 - y], EAST];
                case 3:
                    // End up on the top side of A facing SOUTH
                    return [[y - 100, 0], SOUTH];
            }

            break;
        }
        case EAST: {
            switch (floorDiv(y, SIDE_LENGTH)) {
                case 0:
                    // End up on the right side of D facing WEST (inverted)
                    return [[99, 149 - y], WEST];
                case 1:
                    // End up on bottom side of B facing NORTH
                    return [[y + 50, 49], NORTH];
                case 2:
                    // End up on right side of B facing WEST (inverted)
                    return [[149, 149 - y], WEST];
                case 3:
                    // End up bottom of D facing NORTH
                    return [[y - 100, 149], NORTH];
            }
            break;
        }
        case NORTH: {
            switch (floorDiv(x, SIDE_LENGTH)) {
                case 0:
                    // goes to left side of C facing EAST
                    return [[50, x + 50], EAST];
                case 1:
                    // goes to left side of F facing EAST
                    return [[0, x + 100], EAST];
                case 2:
                    // goes to bottom of F facing NORTH
                    return [[x - 100, 49], NORTH];
            }
            break;
        }
        case SOUTH: {
            switch (floorDiv(x, SIDE_LENGTH)) {
                case 0:
                    // goes to top of B facing SOUTH
                    return [[x + 100, 0], SOUTH];
                case 1:
                    // goes to right of F facing WEST
                    return [[49, x + 100], WEST];
                case 2:
                    // goes to right of C facing WEST
                    return [[99, x - 50], WEST];
            }
            break;
        }
    }
    throw new Error(`unhandled case: pos=${x},${y} dir=${d}`);
};

const floorDiv = (n: number, d: number): number => Math.floor(n / d);

const rotate = (currentFacing: Direction, rotation: Rotation): Direction => {
    const newFacing = currentFacing + (rotation === 'L' ? -1 : 1);
    return (newFacing < 0 ? 4 + newFacing : newFacing % 4) as Direction;
};

/** Position transform is obtained using facing direction as the index */
const TRANSLATIONS: readonly [Point, Point, Point, Point] = Object.freeze([
    [1, 0], // right
    [0, 1], // down
    [-1, 0], // left
    [0, -1], // up
]);

type Rotation = 'R' | 'L';
// /** 0=up 1=right 2=down 3=left*/
type Direction = typeof NORTH | typeof EAST | typeof SOUTH | typeof WEST;

const EAST = 0;
const SOUTH = 1;
const WEST = 2;
const NORTH = 3;

type Move = Rotation | number;
