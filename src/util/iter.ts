/**
 * Take the first n elements from an iterable and puts them in an array. If the iterable runs out
 * of elements, the array elements will be populated with undefined.
 */
export const takeArray = <T>(iterable: Iterable<T>, length: number): Array<T | undefined> => {
    return [...take(iterable, length)];
};

/**
 * Generator that takes the first n elements from an iterable and yields them.
 * If there are no more elements in the iterable, the generator yields undefined.
 *
 * The source iterator is not closed, so any remaining elements can still be read from it.
 */
export function* take<T>(iterable: Iterable<T>, length: number): Generator<T | undefined> {
    const iterator = iterable[Symbol.iterator]();
    let done = false;

    while (length-- > 0) {
        if (!done) {
            const result = iterator.next();
            // once done, `value` is the iterator's return value rather than an element
            if (!result.done) {
                yield result.value;
                continue;
            }
            done = true;
        }
        yield undefined;
    }
}
