export function zip<T = any>(array1: T[], array2: T[]): [T, T][] {
    return [...array1].map((e, i) => [e, array2[i]]);
}

export const max = (array: number[]): number =>
    array.reduce((prev, cur) => (cur > prev ? cur : prev), -Infinity);

export const min = (array: number[]): number =>
    array.reduce((prev, cur) => (cur < prev ? cur : prev), Infinity);
