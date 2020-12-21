import { BaseSolution, Input } from '../solution';
import { max, min } from '../util/fp';
import { adjacencyGenerator3D, Point, Point3D } from '../util/grid';

export class Solution extends BaseSolution {
    public description = `
    --- Day 17: Conway Cubes ---

    As your flight slowly drifts through the sky, the Elves at the Mythical Information Bureau at the North Pole contact you. They'd like some help debugging a malfunctioning experimental energy source aboard one of their super-secret imaging satellites.
    
    The experimental energy source is based on cutting-edge technology: a set of Conway Cubes contained in a pocket dimension! When you hear it's having problems, you can't help but agree to take a look.
    
    The pocket dimension contains an infinite 3-dimensional grid. At every integer 3-dimensional coordinate (x,y,z), there exists a single cube which is either active or inactive.
    
    In the initial state of the pocket dimension, almost all cubes start inactive. The only exception to this is a small flat region of cubes (your puzzle input); the cubes in this region start in the specified active (#) or inactive (.) state.
    
    The energy source then proceeds to boot up by executing six cycles.
    
    Each cube only ever considers its neighbors: any of the 26 other cubes where any of their coordinates differ by at most 1. For example, given the cube at x=1,y=2,z=3, its neighbors include the cube at x=2,y=2,z=2, the cube at x=0,y=2,z=3, and so on.
    
    During a cycle, all cubes simultaneously change their state according to the following rules:
    
    If a cube is active and exactly 2 or 3 of its neighbors are also active, the cube remains active. Otherwise, the cube becomes inactive.
    If a cube is inactive but exactly 3 of its neighbors are active, the cube becomes active. Otherwise, the cube remains inactive.
    The engineers responsible for this experimental energy source would like you to simulate the pocket dimension and determine what the configuration of cubes should be at the end of the six-cycle boot process.
    
    For example, consider the following initial state:
    
    .#.
    ..#
    ###
    Even though the pocket dimension is 3-dimensional, this initial state represents a small 2-dimensional slice of it. (In particular, this initial state defines a 3x3x1 region of the 3-dimensional space.)
    
    Simulating a few cycles from this initial state produces the following configurations, where the result of each cycle is shown layer-by-layer at each given z coordinate (and the frame of view follows the active cells in each cycle):
    
    Before any cycles:
    
    z=0
    .#.
    ..#
    ###
    
    
    After 1 cycle:
    
    z=-1
    #..
    ..#
    .#.
    
    z=0
    #.#
    .##
    .#.
    
    z=1
    #..
    ..#
    .#.
    
    
    After 2 cycles:
    
    z=-2
    .....
    .....
    ..#..
    .....
    .....
    
    z=-1
    ..#..
    .#..#
    ....#
    .#...
    .....
    
    z=0
    ##...
    ##...
    #....
    ....#
    .###.
    
    z=1
    ..#..
    .#..#
    ....#
    .#...
    .....
    
    z=2
    .....
    .....
    ..#..
    .....
    .....
    
    
    After 3 cycles:
    
    z=-2
    .......
    .......
    ..##...
    ..###..
    .......
    .......
    .......
    
    z=-1
    ..#....
    ...#...
    #......
    .....##
    .#...#.
    ..#.#..
    ...#...
    
    z=0
    ...#...
    .......
    #......
    .......
    .....##
    .##.#..
    ...#...
    
    z=1
    ..#....
    ...#...
    #......
    .....##
    .#...#.
    ..#.#..
    ...#...
    
    z=2
    .......
    .......
    ..##...
    ..###..
    .......
    .......
    .......
    After the full six-cycle boot process completes, 112 cubes are left in the active state.
    
    Starting with your given initial configuration, simulate six cycles. How many cubes are left in the active state after the sixth cycle?
    `;

    solvePart1(lines: Input): string {
        const state = new ConwayCubes();
        for (const p of generatePointsFromInput(lines)) {
            state.set(p);
        }

        // iterate 6 steps

        const steps = 6;
        for (let t = 0; t < steps; t++) {
            // console.log(`t=${t}: ${state.size} cells are active`);
            // console.log(state.getStringRepresentationOfSlice(0));
            state.step();
        }

        return state.size.toString();
    }

    solvePart2(lines: Input): string {
        return '';
    }
}

function* generatePointsFromInput(input: Input): Generator<Point3D> {
    const z = 0;
    for (let y = 0; y < input.length; y++) {
        const line = input[y];
        for (let x = 0; x < line.length; x++) {
            const char = line[x];
            if (char === '#') yield [x, y, z];
        }
    }
}

type Key = string;
const key = ([x, y, z]: Point3D): Key => `${x},${y},${z}`;
const keyToPoint = (key: Key): Point3D => key.split(',').map((v) => parseInt(v)) as Point3D;

class ConwayCubes {
    private cells: Set<Key> = new Set();

    get size(): number {
        return this.cells.size;
    }

    set(point: Point3D): void {
        this.cells.add(key(point));
    }

    remove(point: Point3D): void {
        this.cells.delete(key(point));
    }

    step(): void {
        const allPossibleCells: Map<Key, boolean> = new Map();

        // Build a mapping of all possible cell values (ie. adjacent to any currently active cell)
        this.cells.forEach((cellKey) => {
            allPossibleCells.set(cellKey, true);
            Array.from(adjacencyGenerator3D(keyToPoint(cellKey))).forEach((point) => {
                const k = key(point);
                if (this.cells.has(k)) allPossibleCells.set(k, true);
                else allPossibleCells.set(k, false);
            });
        });

        // compute delta (cells that change after this step)
        const delta: Map<Key, boolean> = new Map();
        allPossibleCells.forEach((isActive, cellKey) => {
            const pt = keyToPoint(cellKey);
            // evaluate neighbors
            const neighbors = Array.from(adjacencyGenerator3D(pt));
            const activeNeighbors = neighbors.filter((neighbor) => {
                return allPossibleCells.get(key(neighbor)) || false;
            }).length;
            if (!isActive && activeNeighbors === 3) {
                // flip to active
                // console.log(`setting ${cellKey} to active`);
                delta.set(cellKey, true);
            } else if (isActive && ![2, 3].includes(activeNeighbors)) {
                // console.log(`setting ${cellKey} to inactive (${activeNeighbors} neighbors)`);
                delta.set(cellKey, false);
            }
        });

        // apply delta
        delta.forEach((newValue, key) => {
            if (newValue) this.cells.add(key);
            else this.cells.delete(key);
        });
    }

    getStringRepresentationOfSlice(z: number, bounds?: [Point, Point]): string {
        const activePointsOnSlice: Point3D[] = Array.from(this.cells)
            .map(keyToPoint)
            .filter((p: Point3D) => p[2] === z);

        const activePointKeys: Set<Key> = new Set(activePointsOnSlice.map(key));

        let minX: number;
        let minY: number;
        let maxX: number;
        let maxY: number;

        if (!bounds) {
            const allX = activePointsOnSlice.map((pt) => pt[0]);
            minX = min(allX) || 0;
            maxX = max(allX) || 0;
            const allY = activePointsOnSlice.map((pt) => pt[1]);
            minY = min(allY) || 0;
            maxY = max(allY) || 0;
        } else {
            minX = bounds[0][0];
            minY = bounds[0][1];
            maxX = bounds[1][0];
            maxY = bounds[1][1];
        }

        const lines: string[] = [];
        for (let y = minY; y <= maxY; y++) {
            const line: string[] = [];
            for (let x = minX; x <= maxX; x++) {
                if (activePointKeys.has(key([x, y, z]))) line.push('#');
                else line.push('.');
            }
            lines.push(line.join(''));
        }

        const grid: string = lines.join('\n');

        return [`\nz=${z} (bounds: ${minX},${minY} to ${maxX},${maxY})`, grid].join('\n');
    }
}
