import * as fp from '../../src/util/fp';

describe(__filename, () => {
    describe('#zip', () => {
        it('should zip two arrays together', () => {
            const input1 = ['a', 'b', 'c'];
            const input2 = [1, 2, 3];

            expect(fp.zip(input1, input2)).toStrictEqual([
                ['a', 1],
                ['b', 2],
                ['c', 3],
            ]);
        });
    });

    describe('#max', () => {
        it('should compute the max value of an array', () => {
            expect(fp.max([1, 3, -1, 10, -20])).toBe(10);
            expect(fp.max([-1, -3, -1, -10, -0.5, -20])).toBe(-0.5);
            expect(fp.max([1])).toBe(1);
        });

        it('should return NaN on an empty array', () => {
            expect(fp.max([])).toBeNaN();
        });
    });

    describe('#min', () => {
        it('should compute the min value of an array', () => {
            expect(fp.min([1, 3, -1, 10, -20])).toBe(-20);
            expect(fp.min([-1, -3, -1, -10, -0.5])).toBe(-10);
            expect(fp.min([1])).toBe(1);
        });

        it('should return NaN on an empty array', () => {
            expect(fp.min([])).toBeNaN();
        });
    });

    describe('#product', () => {
        it('should compute the product of an array of numbers', () => {
            expect(fp.product([1, 2, 3])).toBe(6);
            expect(fp.product([-5, 5, -5])).toBe(125);
            expect(fp.product([100])).toBe(100);
        });

        it('should return NaN on an empty array', () => {
            expect(fp.product([])).toBeNaN();
        });
    });

    describe('#sum', () => {
        it('should compute the sum of an array of numbers', () => {
            expect(fp.sum([1, 2, 3, 4])).toBe(10);
            expect(fp.sum([100])).toBe(100);
            expect(fp.sum([100, -100])).toBe(0);
        });

        it('should return zero for an empty array', () => {
            expect(fp.sum([])).toBe(0);
        });
    });
});
