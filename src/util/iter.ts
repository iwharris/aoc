/**
 * Take the first n elements from an iterable and puts them in an array. If the iterable runs out
 * of elements, the array elements will be populated with undefined.
 */
export const takeArray = <T>(iterable: Iterable<T>, length: number): Array<T> => {
    return [...take(iterable, length)];
};

/**
 * Generator that takes the first n elements from an iterable and yields them.
 * If there are no more elements in the interable, the generator returns undefined
 */
export function* take<T>(iterable: Iterable<T>, length: number): Generator<T> {
    const iterator = iterable[Symbol.iterator]();
    while (length-- > 0) yield iterator.next().value;
}
