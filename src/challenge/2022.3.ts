import { BaseSolution } from '../solution';
import { Input } from '../types';
import { sum, zip } from '../util/fp';

export class Solution extends BaseSolution {
    description = `
    --- Day 3: Rucksack Reorganization ---
    One Elf has the important job of loading all of the rucksacks with supplies for the jungle journey. Unfortunately, that Elf didn't quite follow the packing instructions, and so a few items now need to be rearranged.

    Each rucksack has two large compartments. All items of a given type are meant to go into exactly one of the two compartments. The Elf that did the packing failed to follow this rule for exactly one item type per rucksack.

    The Elves have made a list of all of the items currently in each rucksack (your puzzle input), but they need your help finding the errors. Every item type is identified by a single lowercase or uppercase letter (that is, a and A refer to different types of items).

    The list of items for each rucksack is given as characters all on a single line. A given rucksack always has the same number of items in each of its two compartments, so the first half of the characters represent items in the first compartment, while the second half of the characters represent items in the second compartment.

    For example, suppose you have the following list of contents from six rucksacks:

    vJrwpWtwJgWrhcsFMMfFFhFp
    jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
    PmmdzqPrVvPwwTWBwg
    wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
    ttgJtRGJQctTZtZT
    CrZsJsPPZsGzwwsLwLmpwMDw
    The first rucksack contains the items vJrwpWtwJgWrhcsFMMfFFhFp, which means its first compartment contains the items vJrwpWtwJgWr, while the second compartment contains the items hcsFMMfFFhFp. The only item type that appears in both compartments is lowercase p.
    The second rucksack's compartments contain jqHRNqRjqzjGDLGL and rsFMfFZSrLrFZsSL. The only item type that appears in both compartments is uppercase L.
    The third rucksack's compartments contain PmmdzqPrV and vPwwTWBwg; the only common item type is uppercase P.
    The fourth rucksack's compartments only share item type v.
    The fifth rucksack's compartments only share item type t.
    The sixth rucksack's compartments only share item type s.
    To help prioritize item rearrangement, every item type can be converted to a priority:

    Lowercase item types a through z have priorities 1 through 26.
    Uppercase item types A through Z have priorities 27 through 52.
    In the above example, the priority of the item type that appears in both compartments of each rucksack is 16 (p), 38 (L), 42 (P), 22 (v), 20 (t), and 19 (s); the sum of these is 157.

    Find the item type that appears in both compartments of each rucksack. What is the sum of the priorities of those item types?
    `;

    public solvePart1(lines: Input): string {
        return sum(
            lines.map((line) => {
                const [bag1, bag2] = parseRucksacks(line).map(parseBagToItemArray);
                const overlappingItemPriorities: Array<number> = [];
                zip(bag1, bag2).forEach(([itemCount1, itemCount2], idx) => {
                    if (itemCount1 && itemCount2) {
                        overlappingItemPriorities.push(priorityOfIndex(idx));
                    }
                });
                return sum(overlappingItemPriorities);
            })
        ).toString();
    }

    // public solvePart2(lines: Input): string {
    //     throw new NotImplementedError();
    // }
}

const parseRucksacks = (line: string): [string, string] => {
    if (line.length % 2) {
        throw new Error(`Got a line with odd length ${line.length}: '${line}'`);
    }

    const midpoint = line.length / 2;

    return [line.slice(0, midpoint), line.slice(midpoint)];
};

const parseBagToItemArray = (bag: string): ItemArray => {
    const items = new Array<number>(52).fill(0);
    Array.from(bag).forEach((item) => {
        items[indexOf(item)] += 1;
    });
    return items;
};

const priorityOf = (letter: string): number => {
    const code = letter.charCodeAt(0);
    if (letter >= 'a' && letter <= 'z') {
        return code - 96;
    } else if (letter >= 'A' && letter <= 'Z') {
        return code - 38;
    } else {
        throw new Error(`Unknown character '${letter}'`);
    }
};

const indexOf = (letter: string): number => priorityOf(letter) - 1;
const priorityOfIndex = (index: number): number => index + 1;

type ItemArray = Array<number>;
