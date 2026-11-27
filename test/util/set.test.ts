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

describe.each([
    ['unionMany', set.unionMany, [1, 2, 3, 4]],
    ['intersectMany', set.intersectMany, [2]],
    ['differMany', set.differMany, [1]],
])('%s', (_name, combine, expected) => {
    it('should combine the sets without modifying them', () => {
        const inputs = [new Set([1, 2]), new Set([2, 3]), new Set([2, 4])];

        expect([...combine(inputs)].sort()).toEqual(expected);
        expect(inputs.map((s) => [...s])).toEqual([
            [1, 2],
            [2, 3],
            [2, 4],
        ]);
    });

    it('should return an empty set when given no sets', () => {
        expect(combine([])).toEqual(new Set());
    });
});

describe('StringifiedSet', () => {
    it('should add, find and delete values', () => {
        const numbers = new set.StringifiedSet<number>([1, 2]);
        numbers.add(2).add(3);

        expect(numbers.size).toBe(3);
        expect(numbers.has(3)).toBe(true);
        expect(numbers.delete(3)).toBe(true);
        expect(numbers.delete(3)).toBe(false);
        expect([...numbers.values()]).toEqual([1, 2]);
        expect(numbers.decodedSet()).toEqual(new Set([1, 2]));
        expect(numbers.toString()).toBe('[object Set]');

        numbers.clear();
        expect(numbers.size).toBe(0);
    });

    it('should use a custom encoder for the initial values', () => {
        const pairs = new set.StringifiedSet<number[]>([[1, 2]], JSON.parse, JSON.stringify);

        expect(pairs.has([1, 2])).toBe(true);
        expect([...pairs.values()]).toEqual([[1, 2]]);
    });

    it('should call forEach with decoded values and thisArg', () => {
        const seen: unknown[] = [];

        new set.StringifiedSet<number>([1, 2]).forEach(function (this: string, value, value2, all) {
            seen.push([this, value, value2, all.size]);
        }, 'context');

        expect(seen).toEqual([
            ['context', 1, 1, 2],
            ['context', 2, 2, 2],
        ]);
    });
});
