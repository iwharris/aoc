export const countOccurrences = <T extends number | string | symbol>(
    collection: Iterable<T>
): Record<T, number> => {
    return [...collection].reduce((acc, cur) => {
        if (acc[cur]) {
            acc[cur] += 1;
        } else {
            acc[cur] = 1;
        }
        return acc;
    }, {} as Record<T, number>);
};
