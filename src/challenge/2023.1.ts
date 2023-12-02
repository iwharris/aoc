import { BaseSolution } from '../solution';
import { Input } from '../types';
import { sum } from '../util/fp';

export class Solution extends BaseSolution {
    description = `
    --- Day 1: Trebuchet?! ---

    Something is wrong with global snow production, and you've been selected to take a look. The Elves have even given you a map; on it, they've used stars to mark the top fifty locations that are likely to be having problems.
    
    You've been doing this long enough to know that to restore snow operations, you need to check all fifty stars by December 25th.
    
    Collect stars by solving puzzles. Two puzzles will be made available on each day in the Advent calendar; the second puzzle is unlocked when you complete the first. Each puzzle grants one star. Good luck!
    
    You try to ask why they can't just use a weather machine ("not powerful enough") and where they're even sending you ("the sky") and why your map looks mostly blank ("you sure ask a lot of questions") and hang on did you just say the sky ("of course, where do you think snow comes from") when you realize that the Elves are already loading you into a trebuchet ("please hold still, we need to strap you in").
    
    As they're making the final adjustments, they discover that their calibration document (your puzzle input) has been amended by a very young Elf who was apparently just excited to show off her art skills. Consequently, the Elves are having trouble reading the values on the document.
    
    The newly-improved calibration document consists of lines of text; each line originally contained a specific calibration value that the Elves now need to recover. On each line, the calibration value can be found by combining the first digit and the last digit (in that order) to form a single two-digit number.
    
    For example:
    
    1abc2
    pqr3stu8vwx
    a1b2c3d4e5f
    treb7uchet
    
    In this example, the calibration values of these four lines are 12, 38, 15, and 77. Adding these together produces 142.
    
    Consider your entire calibration document. What is the sum of all of the calibration values?

    --- Part Two ---

    Your calculation isn't quite right. It looks like some of the digits are actually spelled out with letters: one, two, three, four, five, six, seven, eight, and nine also count as valid "digits".
    
    Equipped with this new information, you now need to find the real first and last digit on each line. For example:
    
    two1nine
    eightwothree
    abcone2threexyz
    xtwone3four
    4nineeightseven2
    zoneight234
    7pqrstsixteen
    
    In this example, the calibration values are 29, 83, 13, 24, 42, 14, and 76. Adding these together produces 281.
    
    What is the sum of all of the calibration values?
    
    `;

    public solvePart1(lines: Input): string {
        return sum(
            lines.map((str) => {
                const matches = [...str.matchAll(/\d/gm)];
                if (!matches.length) {
                    console.warn(`line ${str} is invalid, returning 0`);
                    return 0;
                }
                const firstDigit = matches[0][0];
                const lastDigit = matches[matches.length - 1][0];

                return parseInt([firstDigit, lastDigit].join(''));
            })
        ).toString();
    }

    public solvePart2(lines: Input): string {
        const digits = '123456789'.split('');
        const words = 'one,two,three,four,five,six,seven,eight,nine'.split(',');
        const reverseWords = words.map(reverseString);
        const tokens = [...digits, ...words];
        const reverseTokens = [...digits, ...reverseWords];

        const firstInstance = (tokenArray: string[], str: string) => {
            const indices = tokenArray
                .map((token) => ({ token, idx: str.indexOf(token) }))
                // Remove entries where the token is not found
                .filter((obj) => obj.idx !== -1)
                // Lowest index first
                .sort((a, b) => a.idx - b.idx);

            return indices[0].token;
        };

        const tokenToDigit = (token: string): string => {
            if (digits.includes(token)) return parseInt(token).toString();
            else if (words.includes(token))
                return (words.findIndex((val) => val === token) + 1).toString();
            else if (reverseWords.includes(token))
                return (reverseWords.findIndex((val) => val === token) + 1).toString();
            throw new Error(`Invalid tokenToDigit arg: ${token}`);
        };

        return sum(
            lines.map((str) => {
                const firstToken = firstInstance(tokens, str);
                const lastToken = firstInstance(reverseTokens, reverseString(str));

                // console.log(
                //     firstToken,
                //     lastToken,
                //     parseInt([firstToken, lastToken].map(tokenToDigit).join(''))
                // );
                return parseInt([firstToken, lastToken].map(tokenToDigit).join(''));
            })
        ).toString();
    }
}

const reverseString = (str: string): string => str.split('').reverse().join('');
