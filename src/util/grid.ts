import { Point, Point2D, PointLike, Vector2DTuple } from './point';
import { StringifiedSet } from './set';

export type OrthogonalDirection = 'N' | 'E' | 'W' | 'S';
export type CardinalDirection = OrthogonalDirection | 'NW' | 'NE' | 'SE' | 'SW';
export const CARDINAL_VECTORS: Record<CardinalDirection, Vector2DTuple> = {
    N: [0, -1],
    E: [1, 0],
    W: [-1, 0],
    S: [0, 1],
    NW: [-1, -1],
    NE: [1, -1],
    SE: [1, 1],
    SW: [-1, 1],
};

// Ordered array of directions, used to calculate rotations
const DIRECTION_ROTATIONS: readonly OrthogonalDirection[] = ['N', 'E', 'S', 'W'];

/** Rotates by 90 degrees. Diagonal directions aren't supported. */
export const rotateDirection = (
    dir: OrthogonalDirection,
    rotation: 'CW' | 'CCW'
): OrthogonalDirection => {
    const index = DIRECTION_ROTATIONS.indexOf(dir);
    if (index === -1) throw new RangeError(`Can't rotate direction ${dir}`);

    return DIRECTION_ROTATIONS[
        (index + DIRECTION_ROTATIONS.length + (rotation === 'CW' ? 1 : -1)) %
            DIRECTION_ROTATIONS.length
    ];
};

export const isPointEqual = (a: Point, b: Point) => a[0] === b[0] && a[1] === b[1];

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

    public isInBounds([x, y]: PointLike): boolean {
        return (
            Number.isInteger(x) &&
            Number.isInteger(y) &&
            x >= 0 &&
            x < this.width &&
            y >= 0 &&
            y < this.height
        );
    }

    public set(point: PointLike, value: V): void {
        if (!this.isInBounds(point))
            throw new RangeError(`Tried to set value for out-of-bounds point [${point}]`);
        this.grid[this.getIndex(point)] = value;
    }

    public getValue(point: PointLike): V {
        if (!this.isInBounds(point))
            throw new RangeError(
                `Tried to get value for out-of-bounds point [${point}]. Grid size is ${this.width}x${this.height}`
            );
        return this.grid[this.getIndex(point)];
    }

    public getIndex([x, y]: PointLike): number {
        return y * this.width + x;
    }

    public getPointFromIndex(index: number): Point {
        const x = index % this.width;
        const y = (index - x) / this.width;
        return [x, y];
    }

    public indexOf(value: V, fromIndex?: number): number | null {
        const index = this.grid.indexOf(value, fromIndex);
        return index === -1 ? null : index;
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
            if (this.height > 1) yield [x, this.height - 1];
        }

        for (let y = 1; y < this.height - 1; y += 1) {
            yield [0, y];
            if (this.width > 1) yield [this.width - 1, y];
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
        slope: Vector2DTuple,
        origin: PointLike = [0, 0],
        options: { excludeOrigin: boolean } = { excludeOrigin: false }
    ): Generator<Point, void, void> {
        const [slopeX, slopeY] = slope;

        if (slopeX === 0 && slopeY === 0)
            throw new RangeError(`Can't generate a line with no slope`);
        let [currentX, currentY] = origin;

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

    /** Returns points along a vertical or horizontal line */
    public *cardinalDirectionLineGenerator(
        [x0, y0]: PointLike,
        [x1, y1]: PointLike
    ): Generator<Point> {
        if (x0 !== x1 && y0 !== y1)
            throw new RangeError('Endpoints of cardinal line must have the same x or y value');

        if (x0 === x1 && y0 === y1) {
            yield [x0, y0];
        } else if (y0 === y1) {
            // horizontal line
            const step = x0 < x1 ? 1 : -1;
            for (let i = x0; i !== x1 + step; i += step) {
                yield [i, y0];
            }
        } else if (x0 === x1) {
            // vertical line
            const step = y0 < y1 ? 1 : -1;
            for (let i = y0; i !== y1 + step; i += step) {
                yield [x0, i];
            }
        }
    }

    /**
     * Generates up to eight Points adjacent to an origin.
     *
     * Out-of-bounds are not iterated over by default; use the includeOutOfBoundsPoints option
     * to change this.
     */
    public *adjacentPointGenerator(
        origin: PointLike,
        options: { includeOutOfBoundsPoints?: boolean; orthogonalOnly?: boolean } = {
            includeOutOfBoundsPoints: false,
            orthogonalOnly: false,
        }
    ): Generator<Point, void, void> {
        const [x, y] = origin;
        const { includeOutOfBoundsPoints, orthogonalOnly } = options;

        const allPoints = [
            orthogonalOnly ? null : [x - 1, y - 1],
            [x, y - 1],
            orthogonalOnly ? null : [x + 1, y - 1],
            [x - 1, y],
            [x + 1, y],
            orthogonalOnly ? null : [x - 1, y + 1],
            [x, y + 1],
            orthogonalOnly ? null : [x + 1, y + 1],
        ].filter(Boolean) as Point[];

        for (const point of allPoints) {
            if (includeOutOfBoundsPoints || this.isInBounds(point)) {
                yield point;
            }
        }
    }

    /**
     * @param options.direction The direction to iterate in (defaults to iterating from the top)
     */
    public *pointGenerator(options?: {
        direction: 'down' | 'left' | 'right' | 'up';
    }): Generator<Point, void, void> {
        const direction = options?.direction ?? 'down';
        switch (direction) {
            case 'down':
                for (let y = 0; y < this.height; y++) {
                    for (let x = 0; x < this.width; x++) {
                        yield [x, y] as Point;
                    }
                }
                break;
            case 'up':
                for (let y = this.height - 1; y >= 0; y--) {
                    for (let x = 0; x < this.width; x++) {
                        yield [x, y] as Point;
                    }
                }
                break;
            case 'right':
                for (let x = 0; x < this.width; x++) {
                    for (let y = 0; y < this.height; y++) {
                        yield [x, y] as Point;
                    }
                }
                break;
            case 'left':
                for (let x = this.width - 1; x >= 0; x--) {
                    for (let y = 0; y < this.height; y++) {
                        yield [x, y] as Point;
                    }
                }
                break;
            default:
                throw new Error(`Unexpected direction ${direction}`);
        }
    }

    public *pointsInRow(row: number): Generator<Point> {
        if (row < 0 || row >= this.height) throw new RangeError(`Row ${row} is out of bounds`);
        for (let x = 0; x < this.width; x++) {
            yield [x, row];
        }
    }

    public *pointsInColumn(column: number): Generator<Point> {
        if (column < 0 || column >= this.width)
            throw new RangeError(`Column ${column} is out of bounds`);
        for (let y = 0; y < this.height; y++) {
            yield [column, y];
        }
    }

    /** Visits every point that is connected to the origin by a path of adjacent points with the same value. */
    public *floodFillGenerator(
        [originX, originY]: PointLike,
        opts: { includeDiagonal?: boolean; isEqual?: (val1: V, val2: V) => boolean } = {}
    ): Generator<Point2D> {
        const { includeDiagonal = true, isEqual = (a: V, b: V) => a === b } = opts;
        const origin = new Point2D(originX, originY);
        const visited = new StringifiedSet<Point2D>([origin], Point2D.fromString);
        const queue: Point2D[] = [origin];

        // The queue grows while we walk it. This avoids recursion, which overflows on large regions.
        for (let i = 0; i < queue.length; i++) {
            const point = queue[i];
            const value = this.getValue(point);

            for (const adjacentPoint of this.adjacentPointGenerator(point, {
                orthogonalOnly: !includeDiagonal,
            })) {
                const p2d = Point2D.fromTuple(adjacentPoint);
                if (!visited.has(p2d) && isEqual(value, this.getValue(p2d))) {
                    visited.add(p2d);
                    queue.push(p2d);
                }
            }
        }

        yield* queue;
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
        newGrid.grid = this.grid.map<T>((v, idx, arr) =>
            callbackFn.call(thisArg, v, this.getPointFromIndex(idx), arr)
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
    forEach(callbackFn: (value: V, index: number, array: V[]) => unknown, thisArg?: any): void {
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
