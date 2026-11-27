import {
    BinaryHeapPriorityQueue,
    DeprecatedHeapPriorityQueue,
    SimplePriorityQueue,
    defaultComparator,
} from '../../../src/util/struct/priority-queue';

describe('BinaryHeapPriorityQueue', () => {
    describe('with default number comparator', () => {
        let pq: BinaryHeapPriorityQueue<number>;

        beforeEach(() => {
            pq = new BinaryHeapPriorityQueue<number>();
        });

        test('should initialize empty', () => {
            expect(pq.size).toBe(0);
            expect(pq.isEmpty()).toBe(true);
            expect(pq.peek()).toBeNull();
        });

        test('should maintain min-heap order', () => {
            pq.push(3);
            pq.push(1);
            pq.push(2);

            expect(pq.pop()).toBe(1);
            expect(pq.pop()).toBe(2);
            expect(pq.pop()).toBe(3);
        });

        test('should handle duplicate values', () => {
            pq.push(1);
            pq.push(1);
            pq.push(1);

            expect(pq.size).toBe(3);
            expect(pq.pop()).toBe(1);
            expect(pq.size).toBe(2);
        });
    });

    describe('with default string comparator', () => {
        let pq: BinaryHeapPriorityQueue<string>;

        beforeEach(() => {
            pq = new BinaryHeapPriorityQueue<string>();
        });

        test('should maintain alphabetical order', () => {
            pq.push('banana');
            pq.push('apple');
            pq.push('cherry');

            expect(pq.pop()).toBe('apple');
            expect(pq.pop()).toBe('banana');
            expect(pq.pop()).toBe('cherry');
        });
    });

    describe('with custom comparator', () => {
        interface Task {
            priority: number;
            name: string;
        }

        let pq: BinaryHeapPriorityQueue<Task>;

        beforeEach(() => {
            pq = new BinaryHeapPriorityQueue<Task>((a, b) => a.priority - b.priority);
        });

        test('should order by custom priority', () => {
            pq.push({ priority: 3, name: 'Low' });
            pq.push({ priority: 1, name: 'High' });
            pq.push({ priority: 2, name: 'Medium' });

            expect(pq.pop()?.name).toBe('High');
            expect(pq.pop()?.name).toBe('Medium');
            expect(pq.pop()?.name).toBe('Low');
        });
    });

    describe('with max heap comparator', () => {
        let pq: BinaryHeapPriorityQueue<number>;

        beforeEach(() => {
            pq = new BinaryHeapPriorityQueue<number>((a, b) => b - a);
        });

        test('should maintain max-heap order', () => {
            pq.push(1);
            pq.push(3);
            pq.push(2);

            expect(pq.pop()).toBe(3);
            expect(pq.pop()).toBe(2);
            expect(pq.pop()).toBe(1);
        });
    });

    describe('edge cases and error handling', () => {
        test('should return null when popping empty queue', () => {
            const pq = new BinaryHeapPriorityQueue<number>();
            expect(pq.pop()).toBeNull();
            pq.push(1);
            pq.pop();
            expect(pq.pop()).toBeNull();
        });

        test('should throw error for unsupported types without custom comparator', () => {
            interface Complex {
                x: number;
                y: number;
            }
            const pq = new BinaryHeapPriorityQueue<Complex>();
            const complex1: Complex = { x: 1, y: 2 };
            const complex2: Complex = { x: 3, y: 4 };

            // First push succeeds because no comparison is needed
            pq.push(complex1);

            // Second push will trigger siftUp and fail
            expect(() => pq.push(complex2)).toThrow(
                'Default comparator only works with numbers and strings'
            );
        });

        test('should handle large number of elements', () => {
            const pq = new BinaryHeapPriorityQueue<number>();
            const n = 1000;

            // Push in reverse order
            for (let i = n; i > 0; i--) {
                pq.push(i);
            }

            expect(pq.size).toBe(n);

            // Should pop in ascending order
            for (let i = 1; i <= n; i++) {
                expect(pq.pop()).toBe(i);
            }
        });

        test('peek should return highest priority item without removing it', () => {
            const pq = new BinaryHeapPriorityQueue<number>();
            pq.push(3);
            pq.push(1);
            pq.push(2);

            expect(pq.peek()).toBe(1);
            expect(pq.size).toBe(3);
            expect(pq.peek()).toBe(1);
        });
    });
});

describe('BinaryHeapPriorityQueue with falsy items', () => {
    it('should pop zeros', () => {
        const pq = new BinaryHeapPriorityQueue<number>();
        [1, 0, 0].forEach((n) => pq.push(n));

        expect([pq.pop(), pq.pop(), pq.pop(), pq.pop()]).toEqual([0, 0, 1, null]);
    });

    it('should pop empty strings', () => {
        const pq = new BinaryHeapPriorityQueue<string>();
        ['', ''].forEach((s) => pq.push(s));

        expect([pq.pop(), pq.pop()]).toEqual(['', '']);
    });
});

describe('SimplePriorityQueue', () => {
    it('should return the highest priority first, newest first among equals', () => {
        const pq = new SimplePriorityQueue<string>();
        expect([pq.isEmpty(), pq.peek(), pq.pop()]).toEqual([true, null, null]);

        pq.push('low', 1);
        pq.push('high', 5);
        pq.push('newer high', 5);
        pq.push('lowest', 0);

        expect([pq.isEmpty(), pq.size, pq.peek()]).toEqual([false, 4, 'newer high']);
        expect([pq.pop(), pq.pop(), pq.pop(), pq.pop()]).toEqual([
            'newer high',
            'high',
            'low',
            'lowest',
        ]);
    });
});

describe('DeprecatedHeapPriorityQueue', () => {
    it('should pop in comparator order', () => {
        const pq = new DeprecatedHeapPriorityQueue<number>((a, b) => a - b);
        expect([pq.isEmpty(), pq.peek(), pq.pop()]).toEqual([true, null, null]);

        [5, 1, 4, 0, 3, 2].forEach((n) => pq.push(n));

        expect([pq.size, pq.peek()]).toEqual([6, 0]);
        expect(Array.from({ length: 6 }, () => pq.pop())).toEqual([0, 1, 2, 3, 4, 5]);
    });
});

describe('defaultComparator', () => {
    it('should reject mixed types', () => {
        expect(() => defaultComparator(1, 'a')).toThrow('only works with numbers and strings');
    });
});
