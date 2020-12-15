import { BaseSolution, Input } from '../solution';
import {
    manhattanDistance,
    Point,
    rotatePointClockwise,
    rotatePointCounterclockwise,
    translatePoint,
} from '../util/grid';

export class Solution extends BaseSolution {
    public description = `
    --- Day 12: Rain Risk ---
    Your ferry made decent progress toward the island, but the storm came in faster than anyone expected. The ferry needs to take evasive actions!

    Unfortunately, the ship's navigation computer seems to be malfunctioning; rather than giving a route directly to safety, it produced extremely circuitous instructions. When the captain uses the PA system to ask if anyone can help, you quickly volunteer.

    The navigation instructions (your puzzle input) consists of a sequence of single-character actions paired with integer input values. After staring at them for a few minutes, you work out what they probably mean:

    Action N means to move north by the given value.
    Action S means to move south by the given value.
    Action E means to move east by the given value.
    Action W means to move west by the given value.
    Action L means to turn left the given number of degrees.
    Action R means to turn right the given number of degrees.
    Action F means to move forward by the given value in the direction the ship is currently facing.
    The ship starts by facing east. Only the L and R actions change the direction the ship is facing. (That is, if the ship is facing east and the next instruction is N10, the ship would move north 10 units, but would still move east if the following action were F.)

    For example:

    F10
    N3
    F7
    R90
    F11
    These instructions would be handled as follows:

    F10 would move the ship 10 units east (because the ship starts by facing east) to east 10, north 0.
    N3 would move the ship 3 units north to east 10, north 3.
    F7 would move the ship another 7 units east (because the ship is still facing east) to east 17, north 3.
    R90 would cause the ship to turn right by 90 degrees and face south; it remains at east 17, north 3.
    F11 would move the ship 11 units south to east 17, south 8.
    At the end of these instructions, the ship's Manhattan distance (sum of the absolute values of its east/west position and its north/south position) from its starting position is 17 + 8 = 25.

    Figure out where the navigation instructions lead. What is the Manhattan distance between that location and the ship's starting position?

    To begin, get your puzzle input.

    --- Part Two ---

    Before you can give the destination to the captain, you realize that the actual action meanings were printed on the back of the instructions the whole time.

    Almost all of the actions indicate how to move a waypoint which is relative to the ship's position:

    Action N means to move the waypoint north by the given value.
    Action S means to move the waypoint south by the given value.
    Action E means to move the waypoint east by the given value.
    Action W means to move the waypoint west by the given value.
    Action L means to rotate the waypoint around the ship left (counter-clockwise) the given number of degrees.
    Action R means to rotate the waypoint around the ship right (clockwise) the given number of degrees.
    Action F means to move forward to the waypoint a number of times equal to the given value.
    The waypoint starts 10 units east and 1 unit north relative to the ship. The waypoint is relative to the ship; that is, if the ship moves, the waypoint moves with it.

    For example, using the same instructions as above:

    F10 moves the ship to the waypoint 10 times (a total of 100 units east and 10 units north), leaving the ship at east 100, north 10. The waypoint stays 10 units east and 1 unit north of the ship.
    N3 moves the waypoint 3 units north to 10 units east and 4 units north of the ship. The ship remains at east 100, north 10.
    F7 moves the ship to the waypoint 7 times (a total of 70 units east and 28 units north), leaving the ship at east 170, north 38. The waypoint stays 10 units east and 4 units north of the ship.
    R90 rotates the waypoint around the ship clockwise 90 degrees, moving it to 4 units east and 10 units south of the ship. The ship remains at east 170, north 38.
    F11 moves the ship to the waypoint 11 times (a total of 44 units east and 110 units south), leaving the ship at east 214, south 72. The waypoint stays 4 units east and 10 units south of the ship.
    After these operations, the ship's Manhattan distance from its starting position is 214 + 72 = 286.

    Figure out where the navigation instructions actually lead. What is the Manhattan distance between that location and the ship's starting position?
    `;

    solvePart1(lines: Input): string {
        const ship = new ShipModel();
        const moves = lines.map(parseLine);

        moves.forEach((move) => ship.move(move));

        const distanceFromOrigin = manhattanDistance([0, 0], ship.position);

        return distanceFromOrigin.toString();
    }

    solvePart2(lines: Input): string {
        const ship = new ShipModel2();
        const moves = lines.map(parseLine);

        moves.forEach((move) => {
            ship.move(move);
            // console.log(`after move ${i}, wp=${ship.waypoint} ship=${ship.position}`);
        });

        const distanceFromOrigin = manhattanDistance([0, 0], ship.position);

        return distanceFromOrigin.toString();
    }
}

const parseLine = (line: string): Move => {
    const matches = line.match(/([NSEWLRF])(\d+)/);
    if (!matches) throw new Error(`Can't match ${line}`);
    return { direction: matches[1] as Compass | Direction, distance: parseInt(matches[2]) };
};

enum Compass {
    NORTH = 'N',
    EAST = 'E',
    SOUTH = 'S',
    WEST = 'W',
}

enum Direction {
    LEFT = 'L',
    RIGHT = 'R',
    FORWARD = 'F',
}

// const isCompassDir = (dir: string): boolean => Object.values(Compass).includes(dir as Compass);
const isDir = (dir: string): boolean => Object.values(Direction).includes(dir as Direction);

interface Move {
    direction: Compass | Direction;
    distance: number;
}

const positionTransforms: Record<Compass, (origin: Point, distance: number) => unknown> = {
    [Compass.NORTH]: (o, d) => translatePoint(o, [0, d]),
    [Compass.SOUTH]: (o, d) => translatePoint(o, [0, -d]),
    [Compass.WEST]: (o, d) => translatePoint(o, [-d, 0]),
    [Compass.EAST]: (o, d) => translatePoint(o, [d, 0]),
};

const directionIndexDelta: Record<Direction, number> = {
    [Direction.FORWARD]: 0,
    [Direction.RIGHT]: 1,
    [Direction.LEFT]: -1,
};

const dirIndex: Compass[] = [Compass.NORTH, Compass.EAST, Compass.SOUTH, Compass.WEST];

const transformFacing = (currentFacing: Compass, move: Direction, distance: number): Compass => {
    const delta = directionIndexDelta[move] * (distance / 90);
    let idx = dirIndex.indexOf(currentFacing);
    idx = (idx + delta) % dirIndex.length;
    if (idx < 0) idx += dirIndex.length;
    return dirIndex[idx];
};

class ShipModel {
    position: Point = [0, 0];
    facing: Compass = Compass.EAST;

    move(move: Move) {
        // console.log(`pos=${this.position} facing: ${this.facing}`);
        if (isDir(move.direction)) {
            // change facing
            this.facing = transformFacing(this.facing, move.direction as Direction, move.distance);
            // console.log(`turning ${move.direction} to ${this.facing}`);
            if (move.direction === Direction.FORWARD) {
                positionTransforms[this.facing](this.position, move.distance);
            }
        } else {
            positionTransforms[move.direction](this.position, move.distance);
        }

        // transform origin by distance
    }
}

class ShipModel2 {
    position: Point = [0, 0];
    waypoint: Point = [10, 1];

    move(move: Move) {
        const { distance, direction } = move;

        if (direction === Direction.FORWARD) {
            // move ship in direction of waypoint x times
            translatePoint(this.position, [
                distance * this.waypoint[0],
                distance * this.waypoint[1],
            ]);
        } else if (isDir(direction)) {
            // console.log(direction);
            const rotateCallback = {
                [Direction.LEFT]: rotatePointCounterclockwise,
                [Direction.RIGHT]: rotatePointClockwise,
            }[direction];

            const iterations = distance / 90;

            for (let i = 0; i < iterations; i++) {
                // console.log(`before rotate: ${this.waypoint}`)
                rotateCallback(this.waypoint);
                // console.log(`after rotate: ${this.waypoint}`)
            }
        } else {
            // Move waypoint by a given distance
            positionTransforms[direction](this.waypoint, distance);
        }
    }
}
