export type Point = [number, number];

export type Vector2D = Point;

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

    public isInBounds(x: number, y: number): boolean {
        return x > 0 && x <= this.width && y > 0 && y <= this.height;
    }

    public set(x: number, y: number, value: V): void {
        if (!this.isInBounds(x, y))
            throw new RangeError(`Tried to set value for out-of-bounds point [${x},${y}]`);
        this.grid[this.getIndex(x, y)] = value;
    }

    public getValue(x: number, y: number): V {
        if (!this.isInBounds(x, y))
            throw new RangeError(`Tried to get value for out-of-bounds point [${x},${y}]`);
        return this.grid[this.getIndex(x, y)];
    }

    public getIndex(x: number, y: number): number {
        return y * this.width + x;
    }

    getPointFromIndex(index: number): Point {
        const x = index % this.width;
        const y = (index - x) / this.width;
        return [x, y];
    }

    public *rectIndexGenerator(
        x: number,
        y: number,
        width: number,
        height: number
    ): Generator<number> {
        for (let gridY = y; gridY < y + height; gridY += 1) {
            for (let gridX = x; gridX < x + width; gridX += 1) {
                yield this.getIndex(gridX, gridY);
            }
        }
    }

    public *edgeIndexGenerator(): Generator<number> {
        for (let x = 0; x < this.width; x += 1) {
            yield this.getIndex(x, 0);
            yield this.getIndex(x, this.height - 1);
        }

        for (let y = 1; y < this.height - 1; y += 1) {
            yield this.getIndex(0, y);
            yield this.getIndex(this.height - 1, y);
        }
    }

    /**
    /**
     * Map over the cell values in this Grid, returning a new Grid constructed from the map callback values.
     *
     * Cells are "visited" in order from left to right and top to bottom.
     *
     * @param callbackFn
     * @param thisArg
     */
    public map<T = any>(
        callbackFn: (value: V, index: number, array: any[]) => T,
        thisArg?: any
    ): Grid<T> {
        const newGrid = new Grid<T>(this.width, this.height);
        newGrid.grid = this.grid.map<T>(callbackFn, thisArg);
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
}
