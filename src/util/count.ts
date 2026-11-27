export const countOccurrences = <T extends number | string | symbol>(
    collection: Iterable<T>
): Record<T, number> => {
    // Count in a Map, so values like 'constructor' don't collide with Object members
    const counts = new Map<T, number>();
    for (const value of collection) {
        counts.set(value, (counts.get(value) ?? 0) + 1);
    }
    return Object.fromEntries(counts) as Record<T, number>;
};
