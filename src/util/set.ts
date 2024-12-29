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

/**
 * A utility class for serializing and deserializing an arbitrary object to strings so that we can benefit from set equality checks.
 */
export class StringifiedSet<T = any> {
    private set: Set<string>;

    constructor(
        arr: T[],
        private decode: (s: string) => T = JSON.parse,
        private encode: (s: T) => string = String
    ) {
        this.set = new Set(arr.map((s) => String(s)));
    }

    decodedSet(): Set<T> {
        return new Set([...this.set.values()].map((s) => this.decode(s)));
    }

    add(value: T): this {
        this.set.add(this.encode(value));
        return this;
    }

    clear(): void {
        this.set.clear();
    }

    delete(value: T): boolean {
        return this.set.delete(this.encode(value));
    }

    forEach(callbackfn: (value: T, value2: T, set: Set<T>) => void, thisArg?: any): void {
        this.set.forEach(
            (value, value2) =>
                callbackfn(this.decode(value), this.decode(value2), this.decodedSet()),
            thisArg
        );
    }

    get size(): number {
        return this.set.size;
    }

    has(value: T): boolean {
        return this.set.has(this.encode(value));
    }

    values(): Iterable<T> {
        return this.decodedSet()[Symbol.iterator]();
    }

    toString(): string {
        return this.set.toString();
    }
}
