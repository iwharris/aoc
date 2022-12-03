import { BaseSolution, Input } from '../solution';
import { zip } from '../util/fp';

export class Solution extends BaseSolution {
    description = `
    --- Day 2: Inventory Management System ---
    You stop falling through time, catch your breath, and check the screen on the device. "Destination reached. Current Year: 1518. Current
    Location: North Pole Utility Closet 83N10." You made it! Now, to find those anomalies.
    
    Outside the utility closet, you hear footsteps and a voice. "...I'm not sure either. But now that so many people have chimneys, maybe he
    could sneak in that way?" Another voice responds, "Actually, we've been working on a new kind of suit that would let him fit through tight
    spaces like that. But, I heard that a few days ago, they lost the prototype fabric, the design plans, everything! Nobody on the team can
    even seem to remember important details of the project!"
    
    "Wouldn't they have had enough fabric to fill several boxes in the warehouse? They'd be stored together, so the box IDs should be similar.
    Too bad it would take forever to search the warehouse for two similar box IDs..." They walk too far away to hear any more.
    
    Late at night, you sneak to the warehouse - who knows what kinds of paradoxes you could cause if you were discovered - and use your fancy
    wrist device to quickly scan every box and produce a list of the likely candidates (your puzzle input).
    
    To make sure you didn't miss any, you scan the likely candidate boxes again, counting the number that have an ID containing exactly two of
    any letter and then separately counting those with exactly three of any letter. You can multiply those two counts together to get a
    rudimentary checksum and compare it to what your device predicts.
    
    For example, if you see the following box IDs:
    
    abcdef contains no letters that appear exactly two or three times.
    bababc contains two a and three b, so it counts for both.
    abbcde contains two b, but no letter appears exactly three times.
    abcccd contains three c, but no letter appears exactly two times.
    aabcdd contains two a and two d, but it only counts once.
    abcdee contains two e.
    ababab contains three a and three b, but it only counts once.
    Of these box IDs, four of them contain a letter which appears exactly twice, and three of them contain a letter which appears exactly three
    times. Multiplying these together produces a checksum of 4 * 3 = 12.
    
    What is the checksum for your list of box IDs?
    
    
    --- Part Two ---
    Confident that your list of box IDs is complete, you're ready to find the boxes full of prototype fabric.
    
    The boxes will have IDs which differ by exactly one character at the same position in both strings. For example, given the following box
    IDs:
    
    abcde
    fghij
    klmno
    pqrst
    fguij
    axcye
    wvxyz
    The IDs abcde and axcye are close, but they differ by two characters (the second and fourth). However, the IDs fghij and fguij differ by
    exactly one character, the third (h and u). Those must be the correct boxes.
    
    What letters are common between the two correct box IDs? (In the example above, this is found by removing the differing character from
    either ID, producing fgij.)`;

    solvePart1(lines: Input): string {
        const counts = lines.map(getLetterBucketsInString);
        const count2 = counts.filter((c) => hasBucketOfSize(c, 2)).length;
        const count3 = counts.filter((c) => hasBucketOfSize(c, 3)).length;
        const result = count2 * count3;

        return result.toString();
    }

    solvePart2(lines: Input): string {
        let found1 = '';
        let found2 = '';
        for (let i = 0; i < lines.length; i += 1) {
            for (let j = i; j < lines.length; j += 1) {
                const diff = getCharacterDifference(lines[i], lines[j]);
                if (diff === 1) {
                    found1 = lines[i];
                    found2 = lines[j];
                    break;
                }
            }
        }

        return getCommonCharacters(found1, found2);
    }
}

function getLetterBucketsInString(str: string) {
    return Array.from(str).reduce((acc, char) => {
        const newAcc = acc;
        if (!acc[char]) {
            newAcc[char] = 1;
        } else {
            newAcc[char] += 1;
        }
        return newAcc;
    }, {});
}

function hasBucketOfSize(buckets: any, targetSize: number): boolean {
    return Object.values(buckets).includes(targetSize);
}

function getCharacterDifference(str1: string, str2: string): number {
    return zip(Array.from(str1), Array.from(str2)).reduce(
        (acc, [c1, c2]) => (c1 !== c2 ? acc + 1 : acc),
        0
    );
}

function getCommonCharacters(str1: string, str2: string): string {
    return zip(Array.from(str1), Array.from(str2)).reduce(
        (acc: string, [c1, c2]) => (c1 === c2 ? acc + c1 : acc),
        ''
    );
}
