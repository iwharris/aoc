import { assert } from 'console';

export type Point = [number, number];
export type Point3D = [number, number, number];
export type PointN = number[];

export type Vector2D = Point;
export type Vector3D = Point3D;
export type VectorN = PointN;

/**
 * A basic data structure that represents a 2-dimensional grid of "cells". The grid offers some common FP methods
 * (map/reduce) over its elements.
 */
export class Grid<V = any> {
    public readonly width: number;
    public readonly height: number;
    public grid: V[];

    constructor(width: number, height: number, initialCellValue?: V) {
        this.width = Number(width);
        this.height = Number(height);
        this.grid = Array(this.width * this.height).fill(initialCellValue);
    }

    public isInBounds([x, y]: Point): boolean {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }

    public set(point: Point, value: V): void {
        if (!this.isInBounds(point))
            throw new RangeError(`Tried to set value for out-of-bounds point [${point}]`);
        this.grid[this.getIndex(point)] = value;
    }

    public getValue(point: Point): V {
        if (!this.isInBounds(point))
            throw new RangeError(
                `Tried to get value for out-of-bounds point [${point}]. Grid size is ${this.width}x${this.height}`
            );
        return this.grid[this.getIndex(point)];
    }

    public getIndex([x, y]: Point): number {
        return y * this.width + x;
    }

    public getPointFromIndex(index: number): Point {
        const x = index % this.width;
        const y = (index - x) / this.width;
        return [x, y];
    }

    public *rectPointGenerator(
        x: number,
        y: number,
        width: number,
        height: number
    ): Generator<Point> {
        for (let gridY = y; gridY < y + height; gridY += 1) {
            for (let gridX = x; gridX < x + width; gridX += 1) {
                yield [gridX, gridY];
            }
        }
    }

    /**
     * Iterare over all points on the grid boundary
     */
    public *edgePointGenerator(): Generator<Point> {
        for (let x = 0; x < this.width; x += 1) {
            yield [x, 0];
            yield [x, this.height - 1];
        }

        for (let y = 1; y < this.height - 1; y += 1) {
            yield [0, y];
            yield [this.width - 1, y];
        }
    }

    /**
     * Generate a series of Points starting at the origin (default 0, 0) and moving along the slope value until the current Point
     * is out of bounds.
     *
     * @param slope
     * @param origin
     * @param options.excludeOrigin don't include the origin in the iterated points
     */
    public *linePointGenerator(
        slope: Vector2D,
        origin: Point = [0, 0],
        options: { excludeOrigin: boolean } = { excludeOrigin: false }
    ): Generator<Point, void, void> {
        const [slopeX, slopeY] = slope;

        if (slopeX === 0 && slopeY === 0)
            throw new RangeError(`Can't generate a line with no slope`);
        let [currentX, currentY]: Point = origin;

        if (options.excludeOrigin) {
            currentX += slopeX;
            currentY += slopeY;
        }

        while (this.isInBounds([currentX, currentY])) {
            yield [currentX, currentY];
            currentX += slopeX;
            currentY += slopeY;
        }
    }

    /**
     * Generates up to eight Points adjacent to an origin.
     *
     * Out-of-bounds are not iterated over by default; use the includeOutOfBoundsPoints option
     * to change this.
     */
    public *adjacentPointGenerator(
        origin: Point,
        options: { includeOutOfBoundsPoints: boolean } = { includeOutOfBoundsPoints: false }
    ): Generator<Point, void, void> {
        const [x, y] = origin;

        const allPoints: Point[] = [
            [x - 1, y - 1],
            [x, y - 1],
            [x + 1, y - 1],
            [x - 1, y],
            [x + 1, y],
            [x - 1, y + 1],
            [x, y + 1],
            [x + 1, y + 1],
        ];

        for (const point of allPoints) {
            if (options.includeOutOfBoundsPoints || this.isInBounds(point)) {
                yield point;
            }
        }
    }

    public *pointGenerator(): Generator<Point, void, void> {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                yield [x, y] as Point;
            }
        }
    }

    public *pointsInRow(row: number): Generator<Point> {
        assert(row >= 0 && row < this.height);
        for (let x = 0; x < this.width; x++) {
            yield [x, row];
        }
    }

    public *pointsInColumn(column: number): Generator<Point> {
        assert(column >= 0 && column < this.height);
        for (let y = 0; y < this.height; y++) {
            yield [column, y];
        }
    }

    /**
     * Map over the cell values in this Grid, returning a new Grid constructed from the map callback values.
     *
     * Cells are "visited" in order from left to right and top to bottom.
     *
     * @param callbackFn
     * @param thisArg
     */
    public map<T = V>(
        callbackFn: (value: V, point: Point, array: V[]) => T,
        thisArg?: any
    ): Grid<T> {
        const newGrid = new Grid<T>(this.width, this.height);
        newGrid.grid = this.grid.map<T>(
            (v, idx, arr) => callbackFn(v, this.getPointFromIndex(idx), arr),
            thisArg
        );
        return newGrid;
    }

    /**
     * Reduce the cell values in this Grid with the given callback and initial value.
     *
     * Cells are "visited" in order from left to right and top to bottom.
     *
     * @param callbackFn
     * @param initialValue
     */
    reduce<T = any>(
        callbackFn: (previous: T, current: V, currentIndex: number, array: V[]) => T,
        initialValue: T
    ): T {
        return this.grid.reduce<T>(callbackFn, initialValue);
    }

    /**
     * Executes a callback for every cell in the grid.
     *
     * Cells are "visited" in order from left to right and top to bottom.
     *
     * @param callbackFn
     * @param thisArg
     */
    forEach(callbackFn: (value: V, index: number, array: V[]) => unknown, thisArg: any): void {
        this.grid.forEach(callbackFn, thisArg);
    }

    // Debug use
    toString() {
        let str = '';

        for (let y = 0; y < this.height; y += 1) {
            const row = this.grid
                .slice(y * this.width, (y + 1) * this.width)
                .map((cellValue) => {
                    const s = String(cellValue);
                    return s.length > 1 ? '.' : s;
                })
                .reduce((rowString, c) => rowString + c, '');
            str += `${row}\n`;
        }

        return str;
    }

    public static loadFromStrings = <V = any>(
        rows: string[],
        transformer: LoaderCallback<V> = (char) => char as unknown as V
    ): Grid<V> => {
        const height = rows.length;
        if (!height) throw new Error(`Cannot create Grid from empty string array`);
        const width = rows[0].length;
        if (!width) throw new Error(`Cannot create Grid with empty rows`);

        const grid = new Grid(width, height);

        for (let y = 0; y < rows.length; y++) {
            const row = rows[y];
            if (row.length !== grid.width)
                throw new Error(
                    `Row "${row}" at index ${y} does not match grid width of ${grid.width}`
                );
            for (let x = 0; x < row.length; x++) {
                const char = row.charAt(x);
                grid.set([x, y], transformer(char, [x, y]));
            }
        }

        return grid;
    };
}

type LoaderCallback<V> = (char: string, point: Point) => V;

export const manhattanDistance = ([x1, y1]: Point, [x2, y2]: Point): number => {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
};

/** Mutates a Point, moving it by some x,y offset. Returns the same Point. */
export const translatePoint = (p: Point, distance: Vector2D): Point => {
    p[0] += distance[0];
    p[1] += distance[1];
    return p;
};

/** Mutates a Point, rotating it clockwise 90 degrees around an optional origin. Returns the same Point. */
export const rotatePointClockwise = (p: Point): Point => {
    const [x, y] = p;
    p[0] = y;
    p[1] = -x;
    return p;
};

/** Mutates a Point, rotating it counterclockwise 90 degrees around an optional origin. Returns the same Point. */
export const rotatePointCounterclockwise = (p: Point): Point => {
    const [x, y] = p;
    p[0] = -y;
    p[1] = x;
    return p;
};

export function* adjacencyGenerator3D(point: Point3D): Generator<Point3D> {
    for (let z = -1; z <= 1; z++) {
        for (let y = -1; y <= 1; y++) {
            for (let x = -1; x <= 1; x++) {
                if ([x, y, z].every((v) => v === 0)) continue;
                const [nx, ny, nz] = [x, y, z].map((offset, i) => point[i] + offset);
                yield [nx, ny, nz];
            }
        }
    }
}

export function* adjacencyGeneratorNDimension(
    point: PointN,
    isRecursiveCall = false
): Generator<PointN> {
    const smallerDimensions = point.slice(0, -1);
    const [dimension] = point.slice(-1);

    // console.log(`split into "${smallerDimensions}", "${dimension}"`)

    const internalGeneratorIterable =
        smallerDimensions.length === 0
            ? [[]]
            : adjacencyGeneratorNDimension(smallerDimensions, true);

    for (const iteratorValue of internalGeneratorIterable) {
        for (let i = -1; i <= 1; i++) {
            // console.log(`yielding ${[...iteratorValue, dimension + i]}`)
            const result = [...iteratorValue, dimension + i];
            // console.log(`result is ${result}`);
            if (!isRecursiveCall && result.every((val, idx) => val === point[idx])) {
                // console.log(
                //     `skipping ${result} because it is identical to the origin point: ${point}`
                // );
                continue; // skip this yield because it's identical to the origin point
            }
            yield result;
        }
    }
}
