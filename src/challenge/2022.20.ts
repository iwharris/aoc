import { BaseSolution } from '../solution';
import { Input } from '../types';
import { sum } from '../util/fp';

export class Solution extends BaseSolution {
    description = `
    --- Day 20: Grove Positioning System ---
    It's finally time to meet back up with the Elves. When you try to contact them, however, you get no reply. Perhaps you're out of range?

    You know they're headed to the grove where the star fruit grows, so if you can figure out where that is, you should be able to meet back up with them.

    Fortunately, your handheld device has a file (your puzzle input) that contains the grove's coordinates! Unfortunately, the file is encrypted - just in case the device were to fall into the wrong hands.

    Maybe you can decrypt it?

    When you were still back at the camp, you overheard some Elves talking about coordinate file encryption. The main operation involved in decrypting the file is called mixing.

    The encrypted file is a list of numbers. To mix the file, move each number forward or backward in the file a number of positions equal to the value of the number being moved. The list is circular, so moving a number off one end of the list wraps back around to the other end as if the ends were connected.

    For example, to move the 1 in a sequence like 4, 5, 6, 1, 7, 8, 9, the 1 moves one position forward: 4, 5, 6, 7, 1, 8, 9. To move the -2 in a sequence like 4, -2, 5, 6, 7, 8, 9, the -2 moves two positions backward, wrapping around: 4, 5, 6, 7, 8, -2, 9.

    The numbers should be moved in the order they originally appear in the encrypted file. Numbers moving around during the mixing process do not change the order in which the numbers are moved.

    Consider this encrypted file:

    1
    2
    -3
    3
    -2
    0
    4
    Mixing this file proceeds as follows:

    Initial arrangement:
    1, 2, -3, 3, -2, 0, 4

    1 moves between 2 and -3:
    2, 1, -3, 3, -2, 0, 4

    2 moves between -3 and 3:
    1, -3, 2, 3, -2, 0, 4

    -3 moves between -2 and 0:
    1, 2, 3, -2, -3, 0, 4

    3 moves between 0 and 4:
    1, 2, -2, -3, 0, 3, 4

    -2 moves between 4 and 1:
    1, 2, -3, 0, 3, 4, -2

    0 does not move:
    1, 2, -3, 0, 3, 4, -2

    4 moves between -3 and 0:
    1, 2, -3, 4, 0, 3, -2
    Then, the grove coordinates can be found by looking at the 1000th, 2000th, and 3000th numbers after the value 0, wrapping around the list as necessary. In the above example, the 1000th number after 0 is 4, the 2000th is -3, and the 3000th is 2; adding these together produces 3.

    Mix your encrypted file exactly once. What is the sum of the three numbers that form the grove coordinates?
    `;

    public solvePart1(lines: Input): string {
        const encryptedFile = EncryptedFile.fromInput(lines);

        encryptedFile.mixNumbers();

        const mixedArray = encryptedFile.generateArray();

        const getValAtIndex = (index: number): number => mixedArray[index % mixedArray.length];

        return sum([getValAtIndex(1000), getValAtIndex(2000), getValAtIndex(3000)]).toString();
    }

    public solvePart2(lines: Input): string {
        const encryptedFile = EncryptedFile.fromInput(lines, 811589153);

        encryptedFile.mixNumbers(10);

        const mixedArray = encryptedFile.generateArray();

        const getValAtIndex = (index: number): number => mixedArray[index % mixedArray.length];

        return sum([getValAtIndex(1000), getValAtIndex(2000), getValAtIndex(3000)]).toString();
    }
}

class EncryptedFile {
    private zeroNode: LinkedListNode;
    private nodePointers: LinkedListNode[] = [];
    public readonly length: number;

    private constructor(list: number[], private decryptionKey: number) {
        this.length = list.length;

        let prev: Partial<LinkedListNode> | undefined = undefined;
        let first: LinkedListNode | undefined = undefined;
        let last: LinkedListNode | undefined = undefined;
        let zeroNode: LinkedListNode | undefined = undefined;

        // Build circular linked list
        for (let i = 0; i < list.length; i += 1) {
            const val = list[i];

            const node: Partial<LinkedListNode> = {
                val,
                prev: prev as LinkedListNode,
            };

            this.nodePointers[i] = node as LinkedListNode;

            if (val === 0) {
                zeroNode = node as LinkedListNode;
            }

            if (prev) prev.next = node as LinkedListNode;

            if (i === 0) first = node as LinkedListNode;
            else if (i === list.length - 1) last = node as LinkedListNode;

            prev = node;
        }

        if (first) first.prev = last as LinkedListNode;
        if (last) last.next = first as LinkedListNode;

        if (!zeroNode) throw new Error('Input did not contain a 0 value');
        this.zeroNode = zeroNode;

        // console.log(first);
        // console.log(last);
        // console.log(this.zeroNode);
    }

    public generateArray(): number[] {
        const array = new Array<number>(this.length);

        let current: LinkedListNode = this.zeroNode;

        for (let i = 0; i < this.length; i += 1) {
            array[i] = current.val;
            current = current.next;
        }

        return array;
    }

    public mixNumbers(iterations = 1): void {
        for (let iter = 0; iter < iterations; iter += 1) {
            for (let i = 0; i < this.length; i += 1) {
                const thisNode = this.nodePointers[i];
                const { val } = thisNode;

                if (!val) continue; // zero is a noop

                // remove node from current position by updating siblings
                thisNode.prev.next = thisNode.next;
                thisNode.next.prev = thisNode.prev;

                // move the current node forwards or backwards in the circular linked list
                const direction = val > 0 ? 'next' : 'prev';
                let currentPointer = thisNode;
                // console.log(`need to move ${val}`);
                const distanceToMove = Math.abs(val) % (this.length - 1);
                for (let j = 0; j < distanceToMove; j += 1) {
                    // move `val` places forward or backward in the circular linked list
                    currentPointer = currentPointer[direction];
                    // console.log(
                    //     `  cur=${currentPointer.val} prev=${currentPointer.prev.val} next=${currentPointer.next.val}`
                    // );
                }

                // If moving backwards, move one extra space since we assume we're inserting after the node that we stop on
                if (direction === 'prev') currentPointer = currentPointer.prev;

                // console.log(
                //     `${val} new position is between ${currentPointer.val} and ${currentPointer.next.val}`
                // );

                // Update the moved node to point to next and prev
                thisNode.prev = currentPointer;
                thisNode.next = currentPointer.next;

                // Update sublings to point to the moved node
                thisNode.prev.next = thisNode;
                thisNode.next.prev = thisNode;

                // console.log(
                //     `prev=${thisNode.prev.val} prev.next=${thisNode.prev.next.val} next=${thisNode.next.val} next.prev=${thisNode.next.prev.val}`
                // );
            }
        }
    }

    static fromInput(lines: Input, decryptionKey = 1): EncryptedFile {
        return new EncryptedFile(
            lines.map((l) => Number(l) * decryptionKey),
            decryptionKey
        );
    }
}

type LinkedListNode = {
    val: number;
    prev: LinkedListNode;
    next: LinkedListNode;
};
