import { BaseSolution } from '../solution';
import { Input } from '../types';
import { Point, Vector2D } from '../util/grid';

export class Solution extends BaseSolution {
    description = `
    --- Day 24: Blizzard Basin ---
    With everything replanted for next year (and with elephants and monkeys to tend the grove), you and the Elves leave for the extraction point.
    
    Partway up the mountain that shields the grove is a flat, open area that serves as the extraction point. It's a bit of a climb, but nothing the expedition can't handle.
    
    At least, that would normally be true; now that the mountain is covered in snow, things have become more difficult than the Elves are used to.
    
    As the expedition reaches a valley that must be traversed to reach the extraction site, you find that strong, turbulent winds are pushing small blizzards of snow and sharp ice around the valley. It's a good thing everyone packed warm clothes! To make it across safely, you'll need to find a way to avoid them.
    
    Fortunately, it's easy to see all of this from the entrance to the valley, so you make a map of the valley and the blizzards (your puzzle input). For example:
    
    #.#####
    #.....#
    #>....#
    #.....#
    #...v.#
    #.....#
    #####.#
    The walls of the valley are drawn as #; everything else is ground. Clear ground - where there is currently no blizzard - is drawn as .. Otherwise, blizzards are drawn with an arrow indicating their direction of motion: up (^), down (v), left (<), or right (>).
    
    The above map includes two blizzards, one moving right (>) and one moving down (v). In one minute, each blizzard moves one position in the direction it is pointing:
    
    #.#####
    #.....#
    #.>...#
    #.....#
    #.....#
    #...v.#
    #####.#
    Due to conservation of blizzard energy, as a blizzard reaches the wall of the valley, a new blizzard forms on the opposite side of the valley moving in the same direction. After another minute, the bottom downward-moving blizzard has been replaced with a new downward-moving blizzard at the top of the valley instead:
    
    #.#####
    #...v.#
    #..>..#
    #.....#
    #.....#
    #.....#
    #####.#
    Because blizzards are made of tiny snowflakes, they pass right through each other. After another minute, both blizzards temporarily occupy the same position, marked 2:
    
    #.#####
    #.....#
    #...2.#
    #.....#
    #.....#
    #.....#
    #####.#
    After another minute, the situation resolves itself, giving each blizzard back its personal space:
    
    #.#####
    #.....#
    #....>#
    #...v.#
    #.....#
    #.....#
    #####.#
    Finally, after yet another minute, the rightward-facing blizzard on the right is replaced with a new one on the left facing the same direction:
    
    #.#####
    #.....#
    #>....#
    #.....#
    #...v.#
    #.....#
    #####.#
    This process repeats at least as long as you are observing it, but probably forever.
    
    Here is a more complex example:
    
    #.######
    #>>.<^<#
    #.<..<<#
    #>v.><>#
    #<^v^^>#
    ######.#
    Your expedition begins in the only non-wall position in the top row and needs to reach the only non-wall position in the bottom row. On each minute, you can move up, down, left, or right, or you can wait in place. You and the blizzards act simultaneously, and you cannot share a position with a blizzard.
    
    In the above example, the fastest way to reach your goal requires 18 steps. Drawing the position of the expedition as E, one way to achieve this is:
    
    Initial state:
    #E######
    #>>.<^<#
    #.<..<<#
    #>v.><>#
    #<^v^^>#
    ######.#
    
    Minute 1, move down:
    #.######
    #E>3.<.#
    #<..<<.#
    #>2.22.#
    #>v..^<#
    ######.#
    
    Minute 2, move down:
    #.######
    #.2>2..#
    #E^22^<#
    #.>2.^>#
    #.>..<.#
    ######.#
    
    Minute 3, wait:
    #.######
    #<^<22.#
    #E2<.2.#
    #><2>..#
    #..><..#
    ######.#
    
    Minute 4, move up:
    #.######
    #E<..22#
    #<<.<..#
    #<2.>>.#
    #.^22^.#
    ######.#
    
    Minute 5, move right:
    #.######
    #2Ev.<>#
    #<.<..<#
    #.^>^22#
    #.2..2.#
    ######.#
    
    Minute 6, move right:
    #.######
    #>2E<.<#
    #.2v^2<#
    #>..>2>#
    #<....>#
    ######.#
    
    Minute 7, move down:
    #.######
    #.22^2.#
    #<vE<2.#
    #>>v<>.#
    #>....<#
    ######.#
    
    Minute 8, move left:
    #.######
    #.<>2^.#
    #.E<<.<#
    #.22..>#
    #.2v^2.#
    ######.#
    
    Minute 9, move up:
    #.######
    #<E2>>.#
    #.<<.<.#
    #>2>2^.#
    #.v><^.#
    ######.#
    
    Minute 10, move right:
    #.######
    #.2E.>2#
    #<2v2^.#
    #<>.>2.#
    #..<>..#
    ######.#
    
    Minute 11, wait:
    #.######
    #2^E^2>#
    #<v<.^<#
    #..2.>2#
    #.<..>.#
    ######.#
    
    Minute 12, move down:
    #.######
    #>>.<^<#
    #.<E.<<#
    #>v.><>#
    #<^v^^>#
    ######.#
    
    Minute 13, move down:
    #.######
    #.>3.<.#
    #<..<<.#
    #>2E22.#
    #>v..^<#
    ######.#
    
    Minute 14, move right:
    #.######
    #.2>2..#
    #.^22^<#
    #.>2E^>#
    #.>..<.#
    ######.#
    
    Minute 15, move right:
    #.######
    #<^<22.#
    #.2<.2.#
    #><2>E.#
    #..><..#
    ######.#
    
    Minute 16, move right:
    #.######
    #.<..22#
    #<<.<..#
    #<2.>>E#
    #.^22^.#
    ######.#
    
    Minute 17, move down:
    #.######
    #2.v.<>#
    #<.<..<#
    #.^>^22#
    #.2..2E#
    ######.#
    
    Minute 18, move down:
    #.######
    #>2.<.<#
    #.2v^2<#
    #>..>2>#
    #<....>#
    ######E#
    What is the fewest number of minutes required to avoid the blizzards and reach the goal?

    --- Part Two ---
    As the expedition reaches the far side of the valley, one of the Elves looks especially dismayed:
    
    He forgot his snacks at the entrance to the valley!
    
    Since you're so good at dodging blizzards, the Elves humbly request that you go back for his snacks. From the same initial conditions, how quickly can you make it from the start to the goal, then back to the start, then back to the goal?
    
    In the above example, the first trip to the goal takes 18 minutes, the trip back to the start takes 23 minutes, and the trip back to the goal again takes 13 minutes, for a total time of 54 minutes.
    
    What is the fewest number of minutes required to reach the goal, go back to the start, then reach the goal again?
    `;

    public solvePart1(lines: Input): string {
        return solve(lines, false).toString();
    }

    public solvePart2(lines: Input): string {
        return solve(lines, true).toString();
    }
}

const encode = (x: number, y: number) => `${x},${y}`;

const solve = (lines: Input, part2: boolean): number => {
    const wallSet = new Set<string>();
    const blizzards = new Array<Blizzard>();

    let maxX = 0;
    let maxY = 0;

    // Position top and left walls at index -1 so that we can easily move blizzards with modular arithmetic
    const offset = -1;

    for (const [y, line] of lines.entries()) {
        for (const [x, char] of [...line].entries()) {
            if (char === '#') {
                maxX = Math.max(x + offset, maxX);
                maxY = Math.max(y + offset, maxY);
                wallSet.add(encode(x + offset, y + offset));
            } else if (DIRECTIONS[char]) {
                blizzards.push({ position: [x + offset, y + offset], direction: DIRECTIONS[char] });
            }
        }
    }

    // add walls surrounding the entrance and exit
    [
        [-1, -2],
        [0, -2],
        [1, -2],
        [maxX, maxY + 1],
        [maxX - 1, maxY + 1],
        [maxX - 2, maxY + 1],
        [maxX - 3, maxY + 1],
    ].forEach(([x, y]) => wallSet.add(encode(x, y)));

    const start = encode(0, -1);
    const end = encode(maxX - 1, maxY);

    // console.log(end);
    // console.log('walls', walls);
    // console.log('initial', blizzards);

    let visited = new Set([start]);

    const goals = part2 ? [end, start, end] : [end];

    let tick = 0;

    while (goals.length > 0) {
        tick += 1;
        // Compute location of blizzards at tick
        const blizzardSet = new Set(
            blizzards.map(({ position: [bx, by], direction: [dx, dy] }) =>
                encode(unsignedModulo(bx + tick * dx, maxX), unsignedModulo(by + tick * dy, maxY))
            )
        );

        const adjacents = new Set(
            [...visited.values()]
                // rehydrate strings to points to do arithmetic
                .map((pointStr) => pointStr.split(',').map(Number) as Point)
                .map(([vx, vy]) =>
                    [...Object.values(DIRECTIONS), [0, 0]].map(([dx, dy]) =>
                        encode(vx + dx, vy + dy)
                    )
                )
                .flat()
        );

        // Discard adjacents that are blocked by a blizzard or wall
        adjacents.forEach((elem) => {
            if (blizzardSet.has(elem) || wallSet.has(elem)) adjacents.delete(elem);
        });

        // basically do an incremental flood fill until we hit the exit goal
        visited = adjacents;

        // console.log(`t=${tick}, visited=`, visited);

        // have we reached the exit?
        if (visited.has(goals[0])) {
            // console.log(`hit goal ${goals[0]} at tick=${tick}`);

            visited = new Set([goals[0]]);
            goals.shift();
        }

        // console.log(`at t=${tick}`, blizzardSet);
        // console.log('adjacents', adjacents);
    }

    return tick;
};

const unsignedModulo = (a: number, b: number) => ((a % b) + b) % b;

const UP = '^';
const RIGHT = '>';
const DOWN = 'v';
const LEFT = '<';

type Direction = typeof UP | typeof RIGHT | typeof DOWN | typeof LEFT;

const DIRECTIONS: Record<Direction, Vector2D> = {
    [UP]: [0, -1],
    [RIGHT]: [1, 0],
    [DOWN]: [0, 1],
    [LEFT]: [-1, 0],
};

type Blizzard = {
    position: Point;
    direction: Vector2D;
};
