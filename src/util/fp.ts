/** Pairs elements by index. The result is always as long as array1. */
export function zip<T1 = any, T2 = T1>(array1: T1[], array2: T2[]): [T1, T2][] {
    return [...array1].map((e, i) => [e, array2[i]]);
}

/** Returns NaN if the array is empty or contains NaN */
export const max = (array: number[]): number => {
    if (!array || array.length === 0) return NaN;
    // reduce rather than Math.max(...array), which overflows the stack on large arrays
    return array.reduce((prev, cur) => Math.max(prev, cur), -Infinity);
};

/** Returns NaN if the array is empty or contains NaN */
export const min = (array: number[]): number => {
    if (!array || array.length === 0) return NaN;
    return array.reduce((prev, cur) => Math.min(prev, cur), Infinity);
};

export const product = (array: number[]): number => {
    if (!array || array.length === 0) return NaN;
    return array.reduce((prev, cur) => prev * cur, 1);
};

export const sum = (array: number[]): number => array.reduce((prev, cur) => prev + cur, 0);

/** Useful for map() calls since it doesn't accept a radix arg. eg. ['1','2','3'].map(toNum) */
export const toNum = (s: string) => parseInt(s);
