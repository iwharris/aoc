import { BaseSolution } from '../solution';
import { Input } from '../types';
import { sum } from '../util/fp';

type Struct = Record<string, { comesAfter: Set<string>; comesBefore: Set<string> }>;
type Seq = Array<string>;

const parseInput = (lines: Input) => {
    const [first, second] = lines.join('\n').split('\n\n');

    return [first.split('\n'), second.split('\n')];
};

const getMiddlePageNum = (input: Array<any>) => Math.floor(input.length / 2.0);

const parseStruct = (lines: string[]): Struct => {
    const struct: Struct = {};

    lines.forEach((line) => {
        const [first, second] = line.split('|');
        if (!struct[first]) {
            struct[first] = { comesAfter: new Set<string>(), comesBefore: new Set<string>() };
        }
        if (!struct[second]) {
            struct[second] = { comesAfter: new Set<string>(), comesBefore: new Set<string>() };
        }

        struct[first].comesBefore.add(second);
        struct[second].comesAfter.add(first);
    });

    return struct;
};

const parseSequence = (line: string) => line.split(',');

const validateSequence = (seq: Seq, struct: Struct): boolean => {
    return seq.every((seqNum, i) => {
        const myStruct = struct[seqNum];

        const seqBefore = seq.slice(0, i);
        const seqAfter = seq.slice(i + 1);

        return (
            seqBefore.every((val) => myStruct.comesAfter.has(val)) &&
            seqAfter.every((val) => myStruct.comesBefore.has(val))
        );
    });
};

export class Solution extends BaseSolution {
    description = ``;

    preserveEmptyLines = true;

    public solvePart1(lines: Input): string {
        const [first, second] = parseInput(lines);

        const struct = parseStruct(first);

        return sum(
            second
                .map((line) => parseSequence(line))
                .filter((seq) => validateSequence(seq, struct))
                .map((validSeq) => parseInt(validSeq[getMiddlePageNum(validSeq)]))
        ).toString();
    }

    public solvePart2(lines: Input): string {
        const [first, second] = parseInput(lines);

        const struct = parseStruct(first);

        return sum(
            second
                .map((line) => parseSequence(line))
                .filter((seq) => !validateSequence(seq, struct))
                .map((invalidSeq) => sortSequence(invalidSeq, struct))
                .map((sortedSeq) => parseInt(sortedSeq[getMiddlePageNum(sortedSeq)]))
        ).toString();
    }
}

const sortSequence = (seq: Seq, struct: Struct): Seq => {
    return [...seq].sort((a, b) => {
        if (struct[a].comesBefore.has(b)) {
            return -1;
        } else if (struct[a].comesAfter.has(b)) {
            return 1;
        }

        throw new Error(`wtf, tried comparing ${a} and ${b} against struct`, struct);
    });
};
