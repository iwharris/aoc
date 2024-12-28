import { type Point as Point2DTuple } from './grid';

type Rotation = 'CW' | 'CCW';

/**
 * A class representing a point in 2D space
 */
export class Point2D implements ArrayLike<number>, Iterable<number> {
    // Interface for ArrayLike
    get length() {
        return 2;
    }
    [n: number]: number;

    // Interface for iterable
    [Symbol.iterator](): Iterator<number, any, any> {
        let index = 0;
        return {
            next: () => ({
                value: this[index++],
                done: index > this.length,
            }),
        };
    }

    constructor(public x: number, public y: number) {
        this[0] = x;
        this[1] = y;
    }

    static fromTuple([x, y]: Point2DTuple): Point2D {
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
