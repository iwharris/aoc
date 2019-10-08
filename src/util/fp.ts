export function zip<T = any>(array1: T[], array2: T[]): [T ,T][] {
    return [...array1].map((e, i) => [e, array2[i]]);
}
  