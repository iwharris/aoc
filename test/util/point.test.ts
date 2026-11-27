import {
    Point2DTuple,
    Point2D,
    adjacencyGeneratorNDimension,
    addPoints,
    copyPoint,
    isAdjacent,
    isEqual,
    rotatePointClockwise,
    rotatePointCounterclockwise,
    translatePoint,
} from '../../src/util/point';

describe('Point2D', () => {
    describe('constructor', () => {
        it('should create a new Point2D instance', () => {
            const point = new Point2D(1, 2);

            expect(point.x).toBe(1);
            expect(point.y).toBe(2);
        });

        it('should set the x and y properties', () => {
            const point = new Point2D(1, 2);

            point.x = 3;
            point.y = 4;

            expect(point.x).toBe(3);
            expect(point.y).toBe(4);
        });

        it('should instantiate from a tuple', () => {
            const tuple: Point2DTuple = [1, 2];
            const point = Point2D.fromTuple(tuple);

            expect(point.x).toBe(1);
            expect(point.y).toBe(2);
        });

        it('should instantiate from a string', () => {
            const str = '1,2';
            const point = Point2D.fromString(str);

            expect(point.x).toBe(1);
            expect(point.y).toBe(2);
        });
    });

    describe('accessor', () => {
        it('should allow index access', () => {
            const point = new Point2D(1, 2);

            expect(point[0]).toBe(1);
            expect(point[1]).toBe(2);
        });

        it('should allow array destructuring', () => {
            const point = new Point2D(1, 2);

            const [x, y] = point;

            expect(x).toBe(1);
            expect(y).toBe(2);
        });

        it('should allow object destructuring', () => {
            const point = new Point2D(1, 2);

            const { x, y } = point;

            expect(x).toBe(1);
            expect(y).toBe(2);
        });

        it('should allow construction of an array from a point', () => {
            const point = new Point2D(1, 2);
            const tuple = [...point];

            expect(tuple).toHaveLength(2);
            expect(tuple[0]).toBe(1);
            expect(tuple[1]).toBe(2);
        });

        it('should print a string representation of the point', () => {
            const point1 = new Point2D(1, 2);
            const point2 = new Point2D(-10, 33);

            expect(point1.toString()).toBe('1,2');
            expect(point2.toString()).toBe('-10,33');
        });
    });

    describe('operations', () => {
        it('should translate the point by a given distance (magnitude = 1)', () => {
            const point = new Point2D(1, 2);
            point.translate(new Point2D(3, 4));

            expect(point.x).toBe(4);
            expect(point.y).toBe(6);
        });

        it('should translate the point by a given distance (magnitude = 2)', () => {
            const point = new Point2D(1, 2);
            point.translate(new Point2D(3, 4), 2);

            expect(point.x).toBe(7);
            expect(point.y).toBe(10);
        });

        it('should deep copy the point', () => {
            const point = new Point2D(1, 2);
            const copy = point.clone();

            expect(copy).not.toBe(point);
            expect(copy.x).toBe(point.x);
            expect(copy.y).toBe(point.y);
            expect(point.isEqualTo(copy)).toBe(true);

            point.x = 10;
            point.y = 11;

            expect(copy.x).not.toBe(point.x);
            expect(copy.y).not.toBe(point.y);
        });

        it('should calculate the Manhattan distance between two points', () => {
            const point1 = new Point2D(1, 2);
            const point2 = new Point2D(3, 4);

            expect(point1.manhattanDistance(point2)).toBe(4);
            expect(point2.manhattanDistance(point1)).toBe(4);
        });

        it('should check adjacency when points are adjacent (cardinal direction)', () => {
            const point1 = new Point2D(1, 2);
            const point2 = new Point2D(2, 2);

            expect(point1.isAdjacentTo(point2)).toBe(true);
            expect(point2.isAdjacentTo(point1)).toBe(true);
            expect(point1.isAdjacentToCardinal(point2)).toBe(true);
            expect(point2.isAdjacentToCardinal(point1)).toBe(true);
        });

        it('should check adjacency when points are adjacent (diagonal direction)', () => {
            const point1 = new Point2D(1, 1);
            const point2 = new Point2D(2, 2);

            expect(point1.isAdjacentTo(point2)).toBe(true);
            expect(point2.isAdjacentTo(point1)).toBe(true);
            expect(point1.isAdjacentToCardinal(point2)).toBe(false);
            expect(point2.isAdjacentToCardinal(point1)).toBe(false);
        });

        it('does not consider equal points to be adjacent', () => {
            const point1 = new Point2D(1, 1);
            const point2 = new Point2D(1, 1);

            expect(point1.isEqualTo(point2)).toBe(true);
            expect(point1.isAdjacentTo(point2)).toBe(false);
            expect(point1.isAdjacentToCardinal(point2)).toBe(false);
            expect(point2.isAdjacentTo(point1)).toBe(false);
            expect(point2.isAdjacentToCardinal(point1)).toBe(false);
        });

        it.each([
            [1, 100],
            [100, 1],
            [-1, 5],
            [2, 1],
        ])('does not consider (%i, %i) adjacent to the origin', (x, y) => {
            const origin = new Point2D(0, 0);
            const point = new Point2D(x, y);

            expect(origin.isAdjacentTo(point)).toBe(false);
            expect(point.isAdjacentTo(origin)).toBe(false);
        });

        it('considers all eight neighbors adjacent', () => {
            const center = new Point2D(5, 5);

            for (const dx of [-1, 0, 1]) {
                for (const dy of [-1, 0, 1]) {
                    if (dx === 0 && dy === 0) continue;
                    expect(center.isAdjacentTo(new Point2D(5 + dx, 5 + dy))).toBe(true);
                }
            }
        });

        it('rotates the point around the origin', () => {
            const point = new Point2D(1, 1);

            point.rotate('CW');

            expect(point.x).toBe(1);
            expect(point.y).toBe(-1);

            point.rotate('CW');

            expect(point.x).toBe(-1);
            expect(point.y).toBe(-1);

            point.rotate('CW');

            expect(point.x).toBe(-1);
            expect(point.y).toBe(1);

            point.rotate('CW');

            expect(point.x).toBe(1);
            expect(point.y).toBe(1);
        });

        it('rotates the point around the origin when the line lies on an axis', () => {
            const point = new Point2D(0, 1);
            point.rotate('CW');

            expect(point.x).toBe(1);
            expect(point.y).toBe(0);

            point.rotate('CCW');

            expect(point.x).toBe(0);
            expect(point.y).toBe(1);

            point.rotate('CCW');

            expect(point.x).toBe(-1);
            expect(point.y).toBe(0);
        });

        it('rotates the point around an origin that is not 0,0', () => {
            const point = new Point2D(1, 1);

            const rotationOrigin = new Point2D(2, 2);
            point.rotate('CW', rotationOrigin);

            expect(point.x).toBe(1);
            expect(point.y).toBe(3);

            point.rotate('CW', rotationOrigin);

            expect(point.x).toBe(3);
            expect(point.y).toBe(3);

            point.rotate('CW', rotationOrigin);

            expect(point.x).toBe(3);
            expect(point.y).toBe(1);

            point.rotate('CCW', new Point2D(-5, -5));

            expect(point.x).toBe(-11);
            expect(point.y).toBe(3);

            point.rotate('CCW', new Point2D(-5, -5));

            expect(point.x).toBe(-13);
            expect(point.y).toBe(-11);
        });
    });
});

describe('tuple helpers', () => {
    it('copyPoint should return an independent copy', () => {
        const point: Point2DTuple = [1, 2];
        const copy = copyPoint(point);

        expect(copy).toEqual([1, 2]);
        expect(copy).not.toBe(point);
    });

    it('translatePoint should mutate and return the same point', () => {
        const point: Point2DTuple = [1, 2];

        expect(translatePoint(point, [3, 4])).toBe(point);
        expect(point).toEqual([4, 6]);

        translatePoint(point, [3, 4], -2);
        expect(point).toEqual([-2, -2]);
    });

    it('addPoints should return a new point and leave the input alone', () => {
        const point: Point2DTuple = [1, 2];

        expect(addPoints(point, [3, 4])).toEqual([4, 6]);
        expect(addPoints(point, [3, 4], 2)).toEqual([7, 10]);
        expect(point).toEqual([1, 2]);
    });

    it.each([
        [0, 0, true],
        [1, 0, true],
        [-1, 1, true],
        [2, 0, false],
        [0, -2, false],
        [1, 100, false],
    ])('isAdjacent of the origin and (%i, %i) should be %s', (x, y, expected) => {
        expect(isAdjacent([0, 0], [x, y])).toBe(expected);
        expect(isAdjacent([x, y], [0, 0])).toBe(expected);
    });

    it('isEqual should require both coordinates to match', () => {
        expect(isEqual([1, 2], [1, 2])).toBe(true);
        expect(isEqual([1, 2], [1, 3])).toBe(false);
        expect(isEqual([1, 2], [0, 2])).toBe(false);
    });

    // Rotation assumes y points up
    it.each([
        ['rotatePointClockwise', rotatePointClockwise, [2, -1]],
        ['rotatePointCounterclockwise', rotatePointCounterclockwise, [-2, 1]],
    ])('%s should mutate and return the same point', (_name, rotate, expected) => {
        const point: Point2DTuple = [1, 2];

        expect(rotate(point)).toBe(point);
        expect(point).toEqual(expected);
    });
});

describe('adjacencyGeneratorNDimension', () => {
    it.each([
        [[5], 2],
        [[5, -3], 8],
        [[5, -3, 0], 26],
        [[5, -3, 0, 7], 80],
    ])('should generate every neighbor of %j exactly once', (origin, count) => {
        const neighbors = [...adjacencyGeneratorNDimension(origin)];

        expect(neighbors).toHaveLength(count);
        expect(new Set(neighbors.map(String)).size).toBe(count);
        expect(neighbors.map(String)).not.toContain(String(origin));
        for (const neighbor of neighbors) {
            expect(neighbor).toHaveLength(origin.length);
            neighbor.forEach((v, i) => expect(Math.abs(v - origin[i])).toBeLessThanOrEqual(1));
        }
    });
});
