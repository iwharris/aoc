export type Point = [number, number];

export class Grid<V> {
    width: number;
    height: number;
    grid: V[];

    constructor(width: number, height: number, initialCellValue?: V) {
        this.width = Number(width);
        this.height = Number(height);
        this.grid = Array(this.width * this.height).fill(initialCellValue);
    }

    getIndex(x: number, y: number): number {
        return y * this.width + x;
    }

    getPointFromIndex(index: number): Point {
        const x = index % this.width;
        const y = (index - x) / this.width;
        return [x, y];
    }

    *rectPointGenerator(x: number, y: number, width: number, height: number) {
        for (let gridY = y; gridY < y + height; gridY += 1) {
            for (let gridX = x; gridX < x + width; gridX += 1) {
                yield this.getIndex(gridX, gridY);
            }
        }
    }

    *edgePointGenerator() {
        for (let x = 0; x < this.width; x += 1) {
            yield this.getIndex(x, 0);
            yield this.getIndex(x, this.height - 1);
        }

        for (let y = 1; y < this.height - 1; y += 1) {
            yield this.getIndex(0, y);
            yield this.getIndex(this.height - 1, y);
        }
    }

    map(callbackFn: (value: V, index: number, array: any[]) => V, thisArg?: any): V[] {
        return this.grid.map(callbackFn, thisArg);
    }

    reduce(callbackFn, accumulator) {
        return this.grid.reduce(callbackFn, accumulator);
    }

    forEach(callbackFn, thisArg) {
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
