export const union = <T1 = any, T2 = T1>(a: Set<T1>, b: Set<T2>): Set<T1 | T2> =>
    new Set<T1 | T2>([...a, ...b]);

export const intersection = <T = any>(a: Set<T>, b: Set<T>): Set<T> =>
    new Set<T>([...a].filter((x) => b.has(x)));

export const difference = <T = any>(a: Set<T>, b: Set<T>): Set<T> =>
    new Set<T>([...a].filter((x) => !b.has(x)));

export const unionMany = <T = any>(sets: Set<T>[]): Set<T> => {
    const [a, ...others] = sets;
    others.forEach((otherSet) => {
        otherSet.forEach((elem) => a.add(elem));
    });

    return a;
};

export const intersectMany = <T = any>(sets: Set<T>[]): Set<T> => {
    const [a, ...others] = sets;
    others.forEach((otherSet) => {
        a.forEach((elem) => {
            if (!otherSet.has(elem)) a.delete(elem);
        });
    });

    return a;
};

export const differMany = <T = any>(sets: Set<T>[]): Set<T> => {
    const [a, ...others] = sets;
    others.forEach((otherSet) => {
        a.forEach((elem) => {
            if (otherSet.has(elem)) a.delete(elem);
        });
    });
    return a;
};
