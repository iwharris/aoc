export type Point2DTuple = [number, number];
export type Point3DTuple = [number, number, number];
export type PointNTuple = number[];

export type Vector2DTuple = Point2DTuple;
export type Vector3DTuple = Point3DTuple;
export type VectorNTuple = PointNTuple;

export type Rotation = 'CW' | 'CCW';

export type PointLike = Point2D | Point2DTuple;
/** Legacy export for compatibility */
export type Point = Point2DTuple;

/**
 * A class representing a point in 2D space
 */
export class Point2D implements ArrayLike<number>, Iterable<number> {
    // Interface for ArrayLike
    get length() {
        return 2;
    }
    [n: number]: number;

    // Interface for Iterable
    [Symbol.iterator](): Iterator<number, any, any> {
        let index = 0;
        return {
            next: () => ({
                value: this[index++],
                done: index > this.length,
            }),
        };
    }

    get [0]() {
        return this.x;
    }

    set [0](x: number) {
        this.x = x;
    }

    get [1]() {
        return this.y;
    }

    set [1](y: number) {
        this.y = y;
    }

    constructor(public x: number, public y: number) {
        this.x = x;
        this.y = y;
    }

    static fromTuple([x, y]: Point2DTuple): Point2D {
        return new Point2D(x, y);
    }

    static fromString(str: string): Point2D {
        const [x, y] = str.split(',').map(Number);
        return new Point2D(x, y);
    }

    toString(): string {
        return `${this.x},${this.y}`;
    }

    /** Returns a deep copy of this point */
    clone(): Point2D {
        return new Point2D(this.x, this.y);
    }

    /** Checks for equality with another point (same x,y coords) */
    isEqualTo(pt: Point2D): boolean {
        return this.x === pt.x && this.y === pt.y;
    }

    /** Mutates this Point by translating it by some distance and (optionally) magnitude */
    translate(distance: Point2D, magnitude = 1): void {
        this.x += distance.x * magnitude;
        this.y += distance.y * magnitude;
    }

    /** Mutates this Point by rotating it around an optional origin that defaults to (0,0) */
    rotate(rotation: Rotation, origin: Point2D = new Point2D(0, 0)): void {
        this.x -= origin.x;
        this.y -= origin.y;

        const { x, y } = this;

        switch (rotation) {
            case 'CW':
                this.x = y;
                this.y = -x;
                break;
            case 'CCW':
                this.x = -y;
                this.y = x;
                break;
        }

        this.x += origin.x;
        this.y += origin.y;
    }

    manhattanDistance(pt: Point2D): number {
        return Math.abs(this.x - pt.x) + Math.abs(this.y - pt.y);
    }

    /**
     * Returns true if this Point is adjacent to the given Point in any of the 8 directions, including diagonals.
     * Does not consider the same 2 points to be adjacent.
     */
    isAdjacentTo(pt: Point2D): boolean {
        return Math.abs(this.x - pt.x) === 1 || Math.abs(this.y - pt.y) === 1;
    }

    /**
     * Returns true if this Point is adjacent to the given Point in the four cardinal directions (up, down, left, right).
     * Does not consider the same point to be adjacent.
     */
    isAdjacentToCardinal(pt: Point2D): boolean {
        return this.manhattanDistance(pt) === 1;
    }
}

export const manhattanDistance = ([x1, y1]: PointLike, [x2, y2]: PointLike): number => {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
};

export const copyPoint = (p: Point2DTuple): Point2DTuple => [
    p[0],
    p[1],
]; /** Mutates a Point, moving it by some x,y offset. Returns the same Point. */

export const translatePoint = (
    p: Point2DTuple,
    distance: Vector2DTuple,
    magnitude = 1
): Point2DTuple => {
    p[0] += distance[0] * magnitude;
    p[1] += distance[1] * magnitude;
    return p;
}; /** Similar to translatePoint but returns a new Point */

export const addPoints = (
    p: Point2DTuple,
    distance: Vector2DTuple,
    magnitude = 1
): Point2DTuple => {
    return translatePoint(copyPoint(p), distance, magnitude);
}; /** Returns true if two Points are adjacent diagonally or in the four cardinal directions */

export const isAdjacent = (p0: Point, p1: Point): boolean =>
    Math.abs(p0[0] - p1[0]) <= 1 &&
    Math.abs(p0[1] - p1[1]) <= 1; /** Checks that two Points are identical coordinates */

export const isEqual = (p0: Point, p1: Point): boolean =>
    p0[0] === p1[0] &&
    p0[1] ===
        p1[1]; /** Mutates a Point, rotating it clockwise 90 degrees around an optional origin. Returns the same Point. */

export const rotatePointClockwise = (p: Point2DTuple): Point2DTuple => {
    const [x, y] = p;
    p[0] = y;
    p[1] = -x;
    return p;
}; /** Mutates a Point, rotating it counterclockwise 90 degrees around an optional origin. Returns the same Point. */

export const rotatePointCounterclockwise = (p: Point2DTuple): Point2DTuple => {
    const [x, y] = p;
    p[0] = -y;
    p[1] = x;
    return p;
};
export function* adjacencyGenerator3D(point: Point3DTuple): Generator<Point3DTuple> {
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
    point: PointNTuple,
    isRecursiveCall = false
): Generator<PointNTuple> {
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
