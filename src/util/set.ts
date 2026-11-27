export const union = <T1 = any, T2 = T1>(a: Set<T1>, b: Set<T2>): Set<T1 | T2> =>
    new Set<T1 | T2>([...a, ...b]);

export const intersection = <T = any>(a: Set<T>, b: Set<T>): Set<T> =>
    new Set<T>([...a].filter((x) => b.has(x)));

export const difference = <T = any>(a: Set<T>, b: Set<T>): Set<T> =>
    new Set<T>([...a].filter((x) => !b.has(x)));

/** Union of all the sets, as a new Set */
export const unionMany = <T = any>(sets: Set<T>[]): Set<T> =>
    new Set<T>(sets.flatMap((s) => [...s]));

/** Elements present in every set, as a new Set */
export const intersectMany = <T = any>([first = new Set<T>(), ...others]: Set<T>[]): Set<T> =>
    new Set<T>([...first].filter((x) => others.every((s) => s.has(x))));

/** Elements of the first set that aren't in any of the others, as a new Set */
export const differMany = <T = any>([first = new Set<T>(), ...others]: Set<T>[]): Set<T> =>
    new Set<T>([...first].filter((x) => !others.some((s) => s.has(x))));

/**
 * A utility class for serializing and deserializing an arbitrary object to strings so that we can benefit from set equality checks.
 *
 * The default encoder (String) and decoder (JSON.parse) only suit numbers and booleans. For other
 * types, pass a matching pair, or objects without a toString() will all look equal.
 */
export class StringifiedSet<T = any> {
    private set: Set<string>;

    constructor(
        arr: T[],
        private decode: (s: string) => T = JSON.parse,
        private encode: (s: T) => string = String
    ) {
        this.set = new Set(arr.map((s) => this.encode(s)));
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
        const decoded = this.decodedSet();
        decoded.forEach((value, value2) => callbackfn.call(thisArg, value, value2, decoded));
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
