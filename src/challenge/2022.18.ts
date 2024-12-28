import { BaseSolution } from '../solution';
import { Input } from '../types';
import { max } from '../util/fp';
import { Point3DTuple, Vector3DTuple } from '../util/point';

export class Solution extends BaseSolution {
    description = `
    --- Day 18: Boiling Boulders ---
    You and the elephants finally reach fresh air. You've emerged near the base of a large volcano that seems to be actively erupting! Fortunately, the lava seems to be flowing away from you and toward the ocean.
    
    Bits of lava are still being ejected toward you, so you're sheltering in the cavern exit a little longer. Outside the cave, you can see the lava landing in a pond and hear it loudly hissing as it solidifies.
    
    Depending on the specific compounds in the lava and speed at which it cools, it might be forming obsidian! The cooling rate should be based on the surface area of the lava droplets, so you take a quick scan of a droplet as it flies past you (your puzzle input).
    
    Because of how quickly the lava is moving, the scan isn't very good; its resolution is quite low and, as a result, it approximates the shape of the lava droplet with 1x1x1 cubes on a 3D grid, each given as its x,y,z position.
    
    To approximate the surface area, count the number of sides of each cube that are not immediately connected to another cube. So, if your scan were only two adjacent cubes like 1,1,1 and 2,1,1, each cube would have a single side covered and five sides exposed, a total surface area of 10 sides.
    
    Here's a larger example:
    
    2,2,2
    1,2,2
    3,2,2
    2,1,2
    2,3,2
    2,2,1
    2,2,3
    2,2,4
    2,2,6
    1,2,5
    3,2,5
    2,1,5
    2,3,5
    In the above example, after counting up all the sides that aren't connected to another cube, the total surface area is 64.
    
    What is the surface area of your scanned lava droplet?

    --- Part Two ---
    Something seems off about your calculation. The cooling rate depends on exterior surface area, but your calculation also included the surface area of air pockets trapped in the lava droplet.
    
    Instead, consider only cube sides that could be reached by the water and steam as the lava droplet tumbles into the pond. The steam will expand to reach as much as possible, completely displacing any air on the outside of the lava droplet but never expanding diagonally.
    
    In the larger example above, exactly one cube of air is trapped within the lava droplet (at 2,2,5), so the exterior surface area of the lava droplet is 58.
    
    What is the exterior surface area of your scanned lava droplet?    
    `;

    public solvePart1(lines: Input): string {
        const world = World.fromInput(lines);

        return world.calculateSurfaceArea().toString();
    }

    public solvePart2(lines: Input): string {
        const world = World.fromInput(lines);

        world.floodFill(0, 0, 0);

        // console.log(world.printSlice(2));
        // world.getAllSlices().forEach((slice, i) => {
        //     console.log(`\n\nslice=${i}\n${slice}`);
        // });

        return world.calculateExternalSurfaceArea().toString();
    }
}

class World {
    // Add 1 cell of padding on all sides so that flood fill can reach the entire exterior
    private PADDING = 1;

    private state: CubicPointArray;
    /** Length of one side of the cube. Equal to the largest dimension of the droplet plus 2*PADDING */
    private sideLength: Vector3DTuple;
    private points: Point3DTuple[];

    constructor(points: Point3DTuple[]) {
        this.points = points.map((p) => p.map((v) => v + this.PADDING) as Point3DTuple);
        this.sideLength = this.getSideLength();
        this.state = this.initState();
    }

    public calculateSurfaceArea(): number {
        let surfaces = 0;
        for (const p of this.points) {
            // console.log(`considering point ${p}`);
            for (const ap of this.generateAdjacentPoints(p)) {
                const isOccupied = this.isPointOccupied(ap);
                // console.log(`  neighboring point ${ap} is ${isOccupied ? '' : 'NOT '}occupied`);
                if (!isOccupied) surfaces += 1;
            }
        }
        return surfaces;
    }

    public calculateExternalSurfaceArea(): number {
        let surfaces = 0;
        for (const p of this.points) {
            // console.log(`considering point ${p}`);
            for (const ap of this.generateAdjacentPoints(p)) {
                const isOccupied = this.isPointOccupiedByWater(ap);
                // console.log(`  neighboring point ${ap} is ${isOccupied ? '' : 'NOT '}occupied`);
                if (isOccupied) surfaces += 1;
            }
        }
        return surfaces;
    }

    private getState([x, y, z]: Point3DTuple): Material {
        return this.state[x][y][z];
    }

    private floodState([x, y, z]: Point3DTuple): void {
        this.state[x][y][z] = WATER;
    }

    public floodFill(x: number, y: number, z: number): void {
        // console.log(x, y, z);
        if (!this.isInBounds([x, y, z])) return;
        // const f = (p: Point3D) => {
        const material = this.state[x][y][z];
        if (material === AIR) {
            // console.log(`${p} is air`);
            this.state[x][y][z] = WATER;

            this.floodFill(x - 1, y, z);
            this.floodFill(x + 1, y, z);
            this.floodFill(x, y - 1, z);
            this.floodFill(x, y + 1, z);
            this.floodFill(x, y, z - 1);
            this.floodFill(x, y, z + 1);
        } else {
            // console.log(`${p} is solid (${material}), stopping recursion.`);
        }
        // };

        // flood fill starting at all eight corners of the cubic space
        // const [mx, my, mz] = this.maxBounds;
        // for (const x of [0, mx]) {
        //     for (const y of [0, my]) {
        //         for (const z of [0, mz]) {
        //             f([x, y, z]);
        //         }
        //     }
        // }
    }

    private isInBounds([x, y, z]: Point3DTuple): boolean {
        return (
            x >= 0 &&
            x < this.sideLength[0] &&
            y >= 0 &&
            y < this.sideLength[1] &&
            z >= 0 &&
            z < this.sideLength[2]
        );
    }

    private isPointOccupied(p: Point3DTuple): boolean {
        return !this.isInBounds(p) ? false : this.getState(p) !== AIR;
    }

    private isPointOccupiedByWater(p: Point3DTuple): boolean {
        return !this.isInBounds(p) ? true : this.getState(p) === WATER;
    }

    /** Generates six adjacent points (may be out of bounds) */
    private *generateAdjacentPoints([x, y, z]: Point3DTuple): Generator<Point3DTuple> {
        yield [x - 1, y, z];
        yield [x + 1, y, z];
        yield [x, y - 1, z];
        yield [x, y + 1, z];
        yield [x, y, z - 1];
        yield [x, y, z + 1];
    }

    static fromInput(lines: Input): World {
        const points = lines.map(
            (line) =>
                /(\d+),(\d+),(\d+)/gm
                    .exec(line)
                    ?.slice(1)
                    .map((v) => parseInt(v)) as Point3DTuple
        );

        return new World(points);
    }

    private initState(): CubicPointArray {
        const [lenX, lenY, lenZ] = this.sideLength;
        const xArray: CubicPointArray = new Array(lenX).fill([[]]);
        for (const xi in xArray) {
            xArray[xi] = new Array(lenY).fill([]);
            for (const yi in xArray[xi]) {
                xArray[xi][yi] = new Array(lenZ).fill(AIR);
            }
        }

        // console.log(xArray);

        for (const [x, y, z] of this.points) {
            xArray[x][y][z] = OBSIDIAN;
        }

        return xArray;
    }

    getSideLength(): Vector3DTuple {
        return this.points
            .reduce(
                ([maxX, maxY, maxZ], [cx, cy, cz]) => [
                    Math.max(maxX, cx),
                    Math.max(maxY, cy),
                    Math.max(maxZ, cz),
                ],
                [-1, -1, -1]
            )
            .map((v) => v + 1 + this.PADDING) as Vector3DTuple;
    }

    public getAllSlices(): string[] {
        const slices: string[] = [];
        for (let i = 0; i < this.state.length; i++) {
            slices.push(this.getSlice(i));
        }
        return slices;
    }

    public getSlice(x: number): string {
        const slice = this.state[x];

        return slice.map((row) => row.map((v) => RENDER[v]).join('')).join('\n');
    }
}

const RENDER: string[] = [
    '.', // air
    '#', // obsidian
    '~', // water
];

type CubicPointArray = Material[][][];

const AIR = 0;
const OBSIDIAN = 1;
const WATER = 2;

type Material = typeof AIR | typeof OBSIDIAN | typeof WATER;
