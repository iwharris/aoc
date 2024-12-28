import { Point2DTuple, Point2D } from '../../src/util/point';

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
