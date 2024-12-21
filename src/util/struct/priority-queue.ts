/**
 * Interface defining the contract for priority queue implementations.
 */
export interface PriorityQueue<T> {
    push(item: T, priority: number): void;
    pop(): T | null;
    peek(): T | null;
    size: number;
    isEmpty(): boolean;
}

/**
 * Type definition for the comparator function.
 * Returns negative if a should come before b,
 * positive if b should come before a,
 * and 0 if they are equal.
 */
export type Comparator<T> = (a: T, b: T) => number;

/**
 * Default comparator for primitive types.
 * Handles numbers and strings, throws error for other types.
 */
export const defaultComparator: Comparator<string | number> = (a, b) => {
    if (typeof a === 'number' && typeof b === 'number') {
        return a - b;
    }
    if (typeof a === 'string' && typeof b === 'string') {
        return a.localeCompare(b);
    }
    throw new Error(
        'Default comparator only works with numbers and strings. Please provide a custom comparator.'
    );
};

type Node<T> = {
    priority: number;
    elem: T;
};
/** Simple array-based priority queue with O(n) push, O(1) pop performance */
export class SimplePriorityQueue<T = any> implements PriorityQueue<T> {
    private queue: Node<T>[] = [];

    /**
     * Enqueues a new element in O(n) time. When enqueueing multiple items with the
     * same priority, the last-inserted item will be returned first.
     */
    push(elem: T, priority: number): void {
        for (let i = 0; i < this.queue.length; i++) {
            if (priority >= this.queue[i].priority) {
                this.queue.splice(i, 0, { elem, priority });
                return;
            }
        }
        this.queue.push({ elem, priority });
    }

    /**
     * Returns the highest-priority element in constant time.
     *
     * @returns the highest-priority element, or null if the queue is empty
     */
    pop(): T | null {
        return this.queue.shift()?.elem ?? null;
    }

    peek(): T | null {
        return this.queue[0]?.elem ?? null;
    }

    get size(): number {
        return this.queue.length;
    }

    isEmpty(): boolean {
        return this.queue.length === 0;
    }
}

const swap = (arr: unknown[], i: number, j: number) => {
    [arr[i], arr[j]] = [arr[j], arr[i]];
};

/**
 * Better priority queue implementation with custom comparator.
 */
export class DeprecatedHeapPriorityQueue<T = any> implements PriorityQueue<T> {
    // Example usage
    // const numberComparator: Comparator<number> = (numberA, numberB) => {
    //   return numberA - numberB;
    // };

    // const queue = new PriorityQueue(numberComparator);

    // queue.add(10);
    // queue.add(30);
    // queue.add(20);

    // while (queue.size) {
    //   console.log(queue.pop());
    // }

    private heap: T[];
    private isGreater: (a: number, b: number) => boolean;

    constructor(comparator: Comparator<T>);
    constructor(comparator: Comparator<T>, init: T[] = []) {
        this.heap = init;
        this.isGreater = (a: number, b: number) => comparator(init[a] as T, init[b] as T) < 0;
    }

    peek(): T | null {
        return this.heap[0] ?? null;
    }

    isEmpty(): boolean {
        return this.heap.length === 0;
    }

    get size(): number {
        return this.heap.length;
    }

    push(value: T): void {
        this.heap.push(value);
        this.siftUp();
    }

    pop(heap = this.heap, value = heap[0], length = heap.length): T | null {
        if (length) {
            swap(heap, 0, length - 1);
        }

        heap.pop();
        this.siftDown();

        return value ?? null;
    }

    private siftUp(): void;
    private siftUp(node = this.size - 1, parent = ((node + 1) >>> 1) - 1): void {
        for (
            ;
            node && this.isGreater(node, parent);
            node = parent, parent = ((node + 1) >>> 1) - 1
        ) {
            swap(this.heap, node, parent);
        }
    }

    private siftDown(): void;
    private siftDown(size = this.size, node = 0, isGreater = this.isGreater): void {
        while (true) {
            const leftNode = (node << 1) + 1;
            const rightNode = leftNode + 1;

            if (
                (leftNode >= size || isGreater(node, leftNode)) &&
                (rightNode >= size || isGreater(node, rightNode))
            ) {
                break;
            }

            const maxChild =
                rightNode < size && isGreater(rightNode, leftNode) ? rightNode : leftNode;

            swap(this.heap, node, maxChild);

            node = maxChild;
        }
    }
}
