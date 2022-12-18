import { assert } from 'console';
import { BaseSolution } from '../solution';
import { Input } from '../types';

export class Solution extends BaseSolution {
    description = `
    --- Day 17: Pyroclastic Flow ---
    Your handheld device has located an alternative exit from the cave for you and the elephants. The ground is rumbling almost continuously now, but the strange valves bought you some time. It's definitely getting warmer in here, though.
    
    The tunnels eventually open into a very tall, narrow chamber. Large, oddly-shaped rocks are falling into the chamber from above, presumably due to all the rumbling. If you can't work out where the rocks will fall next, you might be crushed!
    
    The five types of rocks have the following peculiar shapes, where # is rock and . is empty space:
    
    ####
    
    .#.
    ###
    .#.
    
    ..#
    ..#
    ###
    
    #
    #
    #
    #
    
    ##
    ##
    The rocks fall in the order shown above: first the - shape, then the + shape, and so on. Once the end of the list is reached, the same order repeats: the - shape falls first, sixth, 11th, 16th, etc.
    
    The rocks don't spin, but they do get pushed around by jets of hot gas coming out of the walls themselves. A quick scan reveals the effect the jets of hot gas will have on the rocks as they fall (your puzzle input).
    
    For example, suppose this was the jet pattern in your cave:
    
    >>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>
    In jet patterns, < means a push to the left, while > means a push to the right. The pattern above means that the jets will push a falling rock right, then right, then right, then left, then left, then right, and so on. If the end of the list is reached, it repeats.
    
    The tall, vertical chamber is exactly seven units wide. Each rock appears so that its left edge is two units away from the left wall and its bottom edge is three units above the highest rock in the room (or the floor, if there isn't one).
    
    After a rock appears, it alternates between being pushed by a jet of hot gas one unit (in the direction indicated by the next symbol in the jet pattern) and then falling one unit down. If any movement would cause any part of the rock to move into the walls, floor, or a stopped rock, the movement instead does not occur. If a downward movement would have caused a falling rock to move into the floor or an already-fallen rock, the falling rock stops where it is (having landed on something) and a new rock immediately begins falling.
    
    Drawing falling rocks with @ and stopped rocks with #, the jet pattern in the example above manifests as follows:
    
    The first rock begins falling:
    |..@@@@.|
    |.......|
    |.......|
    |.......|
    +-------+
    
    Jet of gas pushes rock right:
    |...@@@@|
    |.......|
    |.......|
    |.......|
    +-------+
    
    Rock falls 1 unit:
    |...@@@@|
    |.......|
    |.......|
    +-------+
    
    Jet of gas pushes rock right, but nothing happens:
    |...@@@@|
    |.......|
    |.......|
    +-------+
    
    Rock falls 1 unit:
    |...@@@@|
    |.......|
    +-------+
    
    Jet of gas pushes rock right, but nothing happens:
    |...@@@@|
    |.......|
    +-------+
    
    Rock falls 1 unit:
    |...@@@@|
    +-------+
    
    Jet of gas pushes rock left:
    |..@@@@.|
    +-------+
    
    Rock falls 1 unit, causing it to come to rest:
    |..####.|
    +-------+
    
    A new rock begins falling:
    |...@...|
    |..@@@..|
    |...@...|
    |.......|
    |.......|
    |.......|
    |..####.|
    +-------+
    
    Jet of gas pushes rock left:
    |..@....|
    |.@@@...|
    |..@....|
    |.......|
    |.......|
    |.......|
    |..####.|
    +-------+
    
    Rock falls 1 unit:
    |..@....|
    |.@@@...|
    |..@....|
    |.......|
    |.......|
    |..####.|
    +-------+
    
    Jet of gas pushes rock right:
    |...@...|
    |..@@@..|
    |...@...|
    |.......|
    |.......|
    |..####.|
    +-------+
    
    Rock falls 1 unit:
    |...@...|
    |..@@@..|
    |...@...|
    |.......|
    |..####.|
    +-------+
    
    Jet of gas pushes rock left:
    |..@....|
    |.@@@...|
    |..@....|
    |.......|
    |..####.|
    +-------+
    
    Rock falls 1 unit:
    |..@....|
    |.@@@...|
    |..@....|
    |..####.|
    +-------+
    
    Jet of gas pushes rock right:
    |...@...|
    |..@@@..|
    |...@...|
    |..####.|
    +-------+
    
    Rock falls 1 unit, causing it to come to rest:
    |...#...|
    |..###..|
    |...#...|
    |..####.|
    +-------+
    
    A new rock begins falling:
    |....@..|
    |....@..|
    |..@@@..|
    |.......|
    |.......|
    |.......|
    |...#...|
    |..###..|
    |...#...|
    |..####.|
    +-------+
    The moment each of the next few rocks begins falling, you would see this:
    
    |..@....|
    |..@....|
    |..@....|
    |..@....|
    |.......|
    |.......|
    |.......|
    |..#....|
    |..#....|
    |####...|
    |..###..|
    |...#...|
    |..####.|
    +-------+
    
    |..@@...|
    |..@@...|
    |.......|
    |.......|
    |.......|
    |....#..|
    |..#.#..|
    |..#.#..|
    |#####..|
    |..###..|
    |...#...|
    |..####.|
    +-------+
    
    |..@@@@.|
    |.......|
    |.......|
    |.......|
    |....##.|
    |....##.|
    |....#..|
    |..#.#..|
    |..#.#..|
    |#####..|
    |..###..|
    |...#...|
    |..####.|
    +-------+
    
    |...@...|
    |..@@@..|
    |...@...|
    |.......|
    |.......|
    |.......|
    |.####..|
    |....##.|
    |....##.|
    |....#..|
    |..#.#..|
    |..#.#..|
    |#####..|
    |..###..|
    |...#...|
    |..####.|
    +-------+
    
    |....@..|
    |....@..|
    |..@@@..|
    |.......|
    |.......|
    |.......|
    |..#....|
    |.###...|
    |..#....|
    |.####..|
    |....##.|
    |....##.|
    |....#..|
    |..#.#..|
    |..#.#..|
    |#####..|
    |..###..|
    |...#...|
    |..####.|
    +-------+
    
    |..@....|
    |..@....|
    |..@....|
    |..@....|
    |.......|
    |.......|
    |.......|
    |.....#.|
    |.....#.|
    |..####.|
    |.###...|
    |..#....|
    |.####..|
    |....##.|
    |....##.|
    |....#..|
    |..#.#..|
    |..#.#..|
    |#####..|
    |..###..|
    |...#...|
    |..####.|
    +-------+
    
    |..@@...|
    |..@@...|
    |.......|
    |.......|
    |.......|
    |....#..|
    |....#..|
    |....##.|
    |....##.|
    |..####.|
    |.###...|
    |..#....|
    |.####..|
    |....##.|
    |....##.|
    |....#..|
    |..#.#..|
    |..#.#..|
    |#####..|
    |..###..|
    |...#...|
    |..####.|
    +-------+
    
    |..@@@@.|
    |.......|
    |.......|
    |.......|
    |....#..|
    |....#..|
    |....##.|
    |##..##.|
    |######.|
    |.###...|
    |..#....|
    |.####..|
    |....##.|
    |....##.|
    |....#..|
    |..#.#..|
    |..#.#..|
    |#####..|
    |..###..|
    |...#...|
    |..####.|
    +-------+
    To prove to the elephants your simulation is accurate, they want to know how tall the tower will get after 2022 rocks have stopped (but before the 2023rd rock begins falling). In this example, the tower of rocks will be 3068 units tall.
    
    How many units tall will the tower of rocks be after 2022 rocks have stopped falling?
    `;

    public solvePart1(lines: Input): string {
        const iterations = 2022;
        const t = Tetris.fromInput(lines, iterations * 4 + 1000);

        return t.solve(2022).toString();
    }

    public solvePart2(lines: Input): string {
        const t = Tetris.fromInput(lines, 10000000); // use a buffer that is smaller than the real input - we'll calculate the answer from a pattern

        return t.solve(1000000000000).toString();
        // return '';
    }
}

const CHANNEL_WIDTH = 7;

class Tetris {
    public tickNum = 0;
    /** How many shapes have been dropped */
    public shapeCounter = 0;
    public moveCounter = 0;

    private readonly MASKS: ShapeMask[] = SHAPE_MASKS;
    /** array index of the highest line with data */
    public highestLine = -1;

    private state: Uint8Array;

    constructor(private MOVES: Move[], bufferLines: number) {
        this.state = new Uint8Array(bufferLines);
    }

    public solve(count: number) {
        const lengths: number[] = [];
        let lastLength = 0;

        while (this.tickNum < count) {
            // = `${this.shapeCounter % this.MASKS.length}-${
            //     this.moveCounter % this.MOVES.length
            // }`;
            // console.log(`[${this.tickNum}] ${cacheKey}`);

            const shape = [...this.MASKS[this.shapeCounter % this.MASKS.length]];
            this.shapeCounter += 1;

            // Spawn the shape so the bottom edge is 3 spaces above the highest block (or floor)
            // the index is for the top of the shape
            const startingIndex = this.highestLine + 3 + shape.length;
            // console.log(`\nspawning shape at idx=${startingIndex}`);

            // land the rock
            for (let i = startingIndex; i >= 0; i -= 1) {
                // console.log(`top of shape is at index ${i}`);
                const move = this.MOVES[this.moveCounter % this.MOVES.length];
                this.moveCounter += 1;

                // Handle lateral move
                if (this.canMoveLateral(move, shape, i)) {
                    // console.log(`moving ${move}`);
                    shape.forEach((m, i) => (shape[i] = move === '<' ? m << 1 : m >> 1));
                } else {
                    // console.log(`cannot move ${move}, blocked by wall or intersection`);
                }

                // console.log(`after lateral move, shapemask is\n${shape.map(maskToStr).join('\n')}`);

                // drop the shape until it stops
                // check for collision if the shape drops one row

                if (this.intersects(shape, i - 1)) {
                    // if there is any intersection, lock the shape into state and bail out of the falling loop
                    // console.log('if the shape drops one more line, it will collide');
                    shape.forEach((lineMask, lineIndex) => {
                        this.state[i - lineIndex] |= lineMask;

                        assert(!(this.state[i - lineIndex] & 0b10000000));
                    });

                    // then update highestLine to be the top edge of the shape
                    this.highestLine = Math.max(this.highestLine, i);
                    break;
                }
            }

            // console.log(`\nheight=${this.highestLine + 1})`);
            // console.log(this.getDebugState());

            // chamber = chamber.slice(chamber.findIndex((r) => r !== 0b100000001));
            // Keep track of chamber length deltas
            lengths.push(this.highestLine + 1 - lastLength);
            lastLength = this.highestLine + 1;

            if (this.tickNum > 5000) {
                // Find longest sequnce and its pattern
                const [sequence, seqIndex] = findSequence(lengths);
                // console.log(sequence, seqIndex);
                const pattern = findPattern(sequence);
                const patternHeight = pattern.reduce((s, v) => s + v);
                const repetitions = Math.trunc((count - seqIndex) / pattern.length);
                const rocksPostSeq = (count - seqIndex) % pattern.length;
                const preAndPostSeqHeight = pattern
                    .slice(0, rocksPostSeq)
                    .concat(lengths.slice(0, seqIndex))
                    .reduce((s, v) => s + v);

                return preAndPostSeqHeight + repetitions * patternHeight;
            }

            this.tickNum += 1;
        }

        return lastLength;
    }

    private canMoveLateral(direction: Move, shape: ShapeMask, idx: number) {
        if (
            direction === '<' &&
            shape.every((mask) => !(mask & 0b1000000)) &&
            !this.intersects(
                shape.map((m) => m << 1),
                idx
            )
        ) {
            return true;
        } else if (
            direction === '>' &&
            shape.every((mask) => !(mask & 0b0000001)) &&
            !this.intersects(
                shape.map((m) => m >> 1),
                idx
            )
        ) {
            return true;
        }

        return false;
    }

    private intersects(shape: ShapeMask, idx: number) {
        return (
            shape.some((lineMask, lineIdx) => lineMask & this.state[idx - lineIdx]) || // any part of the shape intersects an already-stopped rock
            idx - shape.length + 1 < 0 // any part of the shape intersects the floor
        );
    }

    static fromInput(lines: Input, bufferLines: number) {
        return new Tetris(lines[0].split('') as Move[], bufferLines);
    }

    /**
     * For debug, returns a string representation of the state
     */
    getDebugState() {
        return [
            ...[...this.state]
                .slice(0, this.highestLine + 3 + 1)
                .reverse()
                .map((byte) => `|${maskToStr(byte)}|`),
            '+-------+',
        ].join('\n');
    }
}

const maskToStr = (mask: number) =>
    mask.toString(2).padStart(CHANNEL_WIDTH, '0').replaceAll('0', '.').replaceAll('1', '#');

type Move = '<' | '>';

type ShapeMask = readonly number[];

// Shapes are represented by 7-bit masks with two bits of left-padding (to represent the starting position)
const SHAPE_MASKS: ShapeMask[] = [
    [0b0011110], // - shape
    [0b0001000, 0b0011100, 0b0001000], // + shape
    [0b0000100, 0b0000100, 0b0011100], // backwards L shape
    [0b0010000, 0b0010000, 0b0010000, 0b0010000], // | shape
    [0b0011000, 0b0011000], // square shape
];

const findPattern = (arr) => {
    const dp = arr.map((_) => 0);
    for (let i = 1; i < dp.length; i++) {
        let k = dp[i - 1];
        let done = false;
        while (!done) {
            if (arr[i] === arr[k]) {
                dp[i] = k + 1;
                done = true;
            } else if (k === 0) {
                dp[i] = 0;
                done = true;
            } else {
                k = dp[k - 1];
            }
        }
    }
    return arr.slice(0, arr.length - dp.at(-1));
};

const findSequence = (arr) => {
    const dp = Array.from({ length: arr.length + 1 }).map((_) => Array(arr.length + 1).fill(0));
    let seqLength = 0;
    let index = 0;
    arr.forEach((a, i) => {
        for (let j = i + 2; j <= arr.length; j++) {
            if (a === arr[j - 1] && dp[i][j - 1] < j - i) {
                dp[i + 1][j] = dp[i][j - 1] + 1;
                if (dp[i + 1][j] > seqLength) {
                    seqLength = dp[i + 1][j];
                    index = Math.max(i + 1, index);
                }
            } else {
                dp[i + 1][j] = 0;
            }
        }
    });
    return [arr.slice(index - seqLength, index), index - seqLength];
};
