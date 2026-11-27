import { Grid, rotateDirection } from '../../src/util/grid';
import { PointLike } from '../../src/util/point';

const toStrings = (points: Iterable<PointLike>): string[] =>
    [...points].map((p) => `${p[0]},${p[1]}`);

describe('Grid', () => {
    describe('bounds', () => {
        it.each([
            [0.5, 0],
            [0, 1.5],
            [NaN, 0],
        ])('should treat non-integer point (%d, %d) as out of bounds', (x, y) => {
            const grid = new Grid(2, 2, 0);

            expect(grid.isInBounds([x, y])).toBe(false);
            expect(() => grid.getValue([x, y])).toThrow(RangeError);
            expect(() => grid.set([x, y], 1)).toThrow(RangeError);
        });
    });

    describe('indexOf', () => {
        const grid = Grid.loadFromStrings(['ab', 'cd']);

        it('should return the index of a value, including index zero', () => {
            expect(grid.indexOf('a')).toBe(0);
            expect(grid.indexOf('d')).toBe(3);
        });

        it('should return null for a missing value', () => {
            expect(grid.indexOf('z')).toBeNull();
        });
    });

    describe('forEach', () => {
        it('should visit every cell without needing a thisArg', () => {
            const visited: string[] = [];

            Grid.loadFromStrings(['ab', 'cd']).forEach((value) => visited.push(value));

            expect(visited).toEqual(['a', 'b', 'c', 'd']);
        });
    });

    describe('map', () => {
        it('should call the callback with thisArg as this', () => {
            const mapped = new Grid(1, 1, 2).map(
                function (this: { factor: number }, value) {
                    return value * this.factor;
                },
                { factor: 10 }
            );

            expect(mapped.grid).toEqual([20]);
        });
    });

    describe('edgePointGenerator', () => {
        it.each([
            [3, 1, ['0,0', '1,0', '2,0']],
            [1, 3, ['0,0', '0,1', '0,2']],
            [1, 1, ['0,0']],
            [3, 3, ['0,0', '0,1', '0,2', '1,0', '1,2', '2,0', '2,1', '2,2']],
        ])('should visit each edge point of a %ix%i grid once', (width, height, expected) => {
            const edges = toStrings(new Grid(width, height, 0).edgePointGenerator());

            expect(edges.sort()).toEqual(expected);
        });
    });

    describe('linePointGenerator', () => {
        const grid = new Grid(4, 3, '.');

        it('should start at 0,0 by default and stop at the edge', () => {
            expect(toStrings(grid.linePointGenerator([1, 1]))).toEqual(['0,0', '1,1', '2,2']);
        });

        it('should follow a negative slope from a given origin', () => {
            expect(toStrings(grid.linePointGenerator([-2, -1], [3, 2]))).toEqual(['3,2', '1,1']);
        });

        it('should skip the origin when excludeOrigin is set', () => {
            const line = grid.linePointGenerator([1, 0], [1, 1], { excludeOrigin: true });

            expect(toStrings(line)).toEqual(['2,1', '3,1']);
        });

        it('should generate nothing from an out-of-bounds origin', () => {
            expect(toStrings(grid.linePointGenerator([1, 0], [-1, 0]))).toEqual([]);
        });

        it('should throw for a zero slope', () => {
            // only take one point: without the check, the line never ends
            expect(() => grid.linePointGenerator([0, 0]).next()).toThrow(RangeError);
        });
    });

    describe('adjacentPointGenerator', () => {
        const grid = new Grid(3, 3, '.');
        const adjacent = (
            origin: [number, number],
            options?: { includeOutOfBoundsPoints?: boolean; orthogonalOnly?: boolean }
        ) => toStrings(grid.adjacentPointGenerator(origin, options)).sort();

        it('should generate all eight neighbors of a center point', () => {
            expect(adjacent([1, 1])).toEqual(
                ['0,0', '0,1', '0,2', '1,0', '1,2', '2,0', '2,1', '2,2'].sort()
            );
        });

        it('should omit out-of-bounds neighbors by default', () => {
            expect(adjacent([0, 0])).toEqual(['0,1', '1,0', '1,1']);
        });

        it('should generate only orthogonal neighbors with orthogonalOnly', () => {
            expect(adjacent([1, 1], { orthogonalOnly: true })).toEqual(
                ['0,1', '1,0', '1,2', '2,1'].sort()
            );
        });

        it('should include out-of-bounds neighbors when asked', () => {
            expect(adjacent([0, 0], { includeOutOfBoundsPoints: true })).toEqual(
                ['-1,-1', '-1,0', '-1,1', '0,-1', '0,1', '1,-1', '1,0', '1,1'].sort()
            );
        });

        it('should combine both options', () => {
            const options = { includeOutOfBoundsPoints: true, orthogonalOnly: true };

            expect(adjacent([0, 0], options)).toEqual(['-1,0', '0,-1', '0,1', '1,0'].sort());
        });
    });

    describe('pointGenerator', () => {
        const grid = new Grid(3, 2, '.');

        it('should iterate down by default', () => {
            expect(toStrings(grid.pointGenerator())).toEqual([
                ...['0,0', '1,0', '2,0'],
                ...['0,1', '1,1', '2,1'],
            ]);
        });

        it.each([
            ['down', ['0,0', '1,0', '2,0', '0,1', '1,1', '2,1']],
            ['up', ['0,1', '1,1', '2,1', '0,0', '1,0', '2,0']],
            ['right', ['0,0', '0,1', '1,0', '1,1', '2,0', '2,1']],
            ['left', ['2,0', '2,1', '1,0', '1,1', '0,0', '0,1']],
        ] as const)('should iterate %s in order', (direction, expected) => {
            expect(toStrings(grid.pointGenerator({ direction }))).toEqual(expected);
        });
    });

    describe('floodFillGenerator', () => {
        it('should fill a large region without overflowing the stack', () => {
            const grid = new Grid(200, 200, '.');

            const filled = toStrings(grid.floodFillGenerator([0, 0]));

            expect(filled.length).toBe(40000);
            expect(new Set(filled).size).toBe(40000);
        });

        // The two 'a' cells only touch diagonally
        const diagonal = Grid.loadFromStrings(['a.', '.a']);

        it('should include diagonals by default', () => {
            expect(toStrings(diagonal.floodFillGenerator([0, 0]))).toEqual(['0,0', '1,1']);
        });

        it('should still include diagonals when only isEqual is given', () => {
            const filled = diagonal.floodFillGenerator([0, 0], { isEqual: (a, b) => a === b });

            expect(toStrings(filled)).toEqual(['0,0', '1,1']);
        });

        it('should exclude diagonals when includeDiagonal is false', () => {
            const filled = diagonal.floodFillGenerator([0, 0], { includeDiagonal: false });

            expect(toStrings(filled)).toEqual(['0,0']);
        });
    });

    describe('pointsInColumn', () => {
        const wide = new Grid(4, 2, '.');
        const tall = new Grid(2, 4, '.');

        it('should return every point in the last column of a wide grid', () => {
            expect(toStrings(wide.pointsInColumn(3))).toEqual(['3,0', '3,1']);
        });

        it.each([-1, 2])('should throw for out-of-range column %i of a tall grid', (column) => {
            expect(() => [...tall.pointsInColumn(column)]).toThrow(RangeError);
        });
    });

    describe('pointsInRow', () => {
        const grid = new Grid(4, 2, '.');

        it('should return every point in the last row', () => {
            expect(toStrings(grid.pointsInRow(1))).toEqual(['0,1', '1,1', '2,1', '3,1']);
        });

        it.each([-1, 2])('should throw for out-of-range row %i', (row) => {
            expect(() => [...grid.pointsInRow(row)]).toThrow(RangeError);
        });
    });

    describe('cardinalDirectionLineGenerator', () => {
        const grid = new Grid(4, 4, '.');

        it('should generate a line in either direction, including both endpoints', () => {
            expect(toStrings(grid.cardinalDirectionLineGenerator([2, 1], [0, 1]))).toEqual([
                '2,1',
                '1,1',
                '0,1',
            ]);
        });

        it('should generate a vertical line in either direction', () => {
            expect(toStrings(grid.cardinalDirectionLineGenerator([1, 0], [1, 2]))).toEqual([
                '1,0',
                '1,1',
                '1,2',
            ]);
            expect(toStrings(grid.cardinalDirectionLineGenerator([1, 2], [1, 0]))).toEqual([
                '1,2',
                '1,1',
                '1,0',
            ]);
        });

        it('should generate a single point when both endpoints match', () => {
            expect(toStrings(grid.cardinalDirectionLineGenerator([2, 3], [2, 3]))).toEqual(['2,3']);
        });

        it('should throw for a diagonal line', () => {
            expect(() => [...grid.cardinalDirectionLineGenerator([0, 0], [1, 1])]).toThrow(
                RangeError
            );
        });
    });
});

describe('rotateDirection', () => {
    it.each([
        ['N', 'E', 'W'],
        ['E', 'S', 'N'],
        ['S', 'W', 'E'],
        ['W', 'N', 'S'],
    ] as const)('should rotate %s to %s clockwise and %s counterclockwise', (dir, cw, ccw) => {
        expect(rotateDirection(dir, 'CW')).toBe(cw);
        expect(rotateDirection(dir, 'CCW')).toBe(ccw);
    });

    it.each(['NW', 'NE', 'SE', 'SW'])('should throw for diagonal direction %s', (dir) => {
        // cast: diagonals are also meant to be rejected by the type
        expect(() => rotateDirection(dir as any, 'CW')).toThrow(RangeError);
    });
});
