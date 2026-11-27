import { take, takeArray } from '../../src/util/iter';

function* oneThenReturn() {
    yield 1;
    return 99;
}

describe.each([
    ['takeArray', takeArray],
    ['take', <T>(iterable: Iterable<T>, length: number) => [...take(iterable, length)]],
])('%s', (_name, subject) => {
    it('should return the first n elements', () => {
        expect(subject([1, 2, 3], 2)).toEqual([1, 2]);
    });

    it('should pad with undefined when the iterable runs out', () => {
        expect(subject([1], 3)).toEqual([1, undefined, undefined]);
    });

    it.each([0, -1])('should return nothing for a length of %i', (length) => {
        expect(subject([1], length)).toEqual([]);
    });

    it("should not include a generator's return value", () => {
        expect(subject(oneThenReturn(), 3)).toEqual([1, undefined, undefined]);
    });

    it('should stop calling next once the iterator is done', () => {
        const next = jest.fn(() => ({ done: true as const, value: undefined }));

        subject({ [Symbol.iterator]: () => ({ next }) }, 3);

        expect(next).toHaveBeenCalledTimes(1);
    });

    it('should leave the rest of a generator readable', () => {
        function* numbers() {
            yield 1;
            yield 2;
            yield 3;
        }
        const source = numbers();

        subject(source, 1);

        expect([...source]).toEqual([2, 3]);
    });
});

describe('types', () => {
    it('should include undefined, because of the padding', () => {
        // @ts-expect-error: elements may be undefined
        const array: number[] = takeArray([1], 2);
        // @ts-expect-error: elements may be undefined
        const generator: Generator<number> = take([1], 2);

        expect([array, [...generator]]).toHaveLength(2);
    });
});
