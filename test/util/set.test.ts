import * as set from '../../src/util/set';

describe(__filename, () => {
    describe('#union', () => {
        it('should compute the union of two sets', () => {
            const input1 = new Set(['a', 'b', 'c']);
            const input2 = new Set([1, 2, 3, 4]);

            const union = set.union(input1, input2);

            expect(union.size).toBe(7);

            for (const val of [...input1, ...input2]) {
                expect(union.has(val)).toBe(true);
            }
        });

        it('should compute the union of empty sets', () => {
            expect(set.union(new Set(), new Set()).size).toBe(0);
            expect(set.union(new Set([1, 2, 3]), new Set([])).size).toBe(3);
            expect(set.union(new Set([]), new Set([4, 5, 6, 7])).size).toBe(4);
        });
    });

    describe('#intersection', () => {
        it('should compute the intersection of two sets', () => {
            const input1 = new Set([1, 2, 3]);
            const input2 = new Set([3, 4, 5]);

            const intersection = set.intersection(input1, input2);

            expect(intersection.size).toBe(1);
            expect(intersection.has(3)).toBe(true);
        });

        it('should compute the intersection of empty sets', () => {
            expect(set.intersection(new Set(), new Set()).size).toBe(0);
            expect(set.intersection(new Set([1, 2, 3]), new Set()).size).toBe(0);
            expect(set.intersection(new Set(), new Set([4, 5, 6])).size).toBe(0);
        });
    });

    describe('#difference', () => {
        it('should compute the difference of two sets', () => {
            const input1 = new Set([1, 2, 3]);
            const input2 = new Set([3, 4, 5]);

            const difference = set.difference(input1, input2);

            expect(difference.size).toBe(2);
            expect(difference.has(1)).toBe(true);
            expect(difference.has(2)).toBe(true);
            expect(difference.has(3)).toBe(false);
        });

        it('should compute the difference of empty sets', () => {
            expect(set.difference(new Set(), new Set()).size).toBe(0);
            expect(set.difference(new Set([1, 2, 3]), new Set()).size).toBe(3);
            expect(set.difference(new Set(), new Set([3, 4, 5])).size).toBe(0);
        });
    });
});
