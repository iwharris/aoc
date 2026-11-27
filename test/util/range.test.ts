import AocRange from '../../src/util/range';

const range = (start: number, end: number) => new AocRange(start, end);

describe('AocRange', () => {
    it('should order its bounds', () => {
        expect(range(5, 1).toString()).toBe('[1,5]');
        expect(range(1, 5).toString()).toBe('[1,5]');
    });

    it.each([
        [1, 3, 3],
        [5, 5, 1],
        [-2, 2, 5],
    ])('should count both ends in the length of [%i,%i]', (start, end, length) => {
        expect(range(start, end).length).toBe(length);
    });

    it('should include its endpoints', () => {
        expect([0, 1, 3, 4].map((n) => range(1, 3).includes(n))).toEqual([
            false,
            true,
            true,
            false,
        ]);
    });

    it.each([
        [range(3, 8), '[3,5]'],
        [range(0, 1), '[1,1]'],
        [range(2, 3), '[2,3]'],
        [range(0, 9), '[1,5]'],
        [range(6, 9), null],
    ])('should intersect [1,5] with %s', (other, expected) => {
        const base = range(1, 5);

        expect(base.intersects(other)).toBe(expected !== null);
        expect(base.intersection(other)?.toString() ?? null).toBe(expected);
    });

    it('should know whether it contains another range', () => {
        expect(range(1, 5).contains(range(1, 5))).toBe(true);
        expect(range(1, 5).contains(range(4, 6))).toBe(false);
    });

    it('should sort by ascending start', () => {
        const sorted = [range(5, 6), range(1, 9), range(3, 4)].sort(AocRange.ascendingComparator);

        expect(sorted.map(String)).toEqual(['[1,9]', '[3,4]', '[5,6]']);
    });
});
