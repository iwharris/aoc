export function zip<T1 = any, T2 = T1>(array1: T1[], array2: T2[]): [T1, T2][] {
    return [...array1].map((e, i) => [e, array2[i]]);
}

export const max = (array: number[]): number | undefined => {
    if (!array || array.length === 0) return NaN;
    return array.reduce((prev, cur) => (cur > prev ? cur : prev), -Infinity);
};

export const min = (array: number[]): number | undefined => {
    if (!array || array.length === 0) return NaN;
    return array.reduce((prev, cur) => (cur < prev ? cur : prev), Infinity);
};

export const product = (array: number[]): number | undefined => {
    if (!array || array.length === 0) return NaN;
    return array.reduce((prev, cur) => prev * cur, 1);
};

export const sum = (array: number[]): number => array.reduce((prev, cur) => prev + cur, 0);
