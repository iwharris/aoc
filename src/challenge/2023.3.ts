import { BaseSolution } from '../solution';
import { Input } from '../types';
import { sum } from '../util/fp';
import { Grid, Vector2D } from '../util/grid';

export class Solution extends BaseSolution {
    description = `
    --- Day 3: Gear Ratios ---

    You and the Elf eventually reach a gondola lift station; he says the gondola lift will take you up to the water source, but this is as far as he can bring you. You go inside.
    
    It doesn't take long to find the gondolas, but there seems to be a problem: they're not moving.
    
    "Aaah!"
    
    You turn around to see a slightly-greasy Elf with a wrench and a look of surprise. "Sorry, I wasn't expecting anyone! The gondola lift isn't working right now; it'll still be a while before I can fix it." You offer to help.
    
    The engineer explains that an engine part seems to be missing from the engine, but nobody can figure out which one. If you can add up all the part numbers in the engine schematic, it should be easy to work out which part is missing.
    
    The engine schematic (your puzzle input) consists of a visual representation of the engine. There are lots of numbers and symbols you don't really understand, but apparently any number adjacent to a symbol, even diagonally, is a "part number" and should be included in your sum. (Periods (.) do not count as a symbol.)
    
    Here is an example engine schematic:
    
    467..114..
    ...*......
    ..35..633.
    ......#...
    617*......
    .....+.58.
    ..592.....
    ......755.
    ...$.*....
    .664.598..
    
    In this schematic, two numbers are not part numbers because they are not adjacent to a symbol: 114 (top right) and 58 (middle right). Every other number is adjacent to a symbol and so is a part number; their sum is 4361.
    
    Of course, the actual engine schematic is much larger. What is the sum of all of the part numbers in the engine schematic?
    
    `;

    public solvePart1(lines: Input): string {
        // Create grid to check adjacency
        const digits = '0123456789'.split('');
        const isDigit = (d: string) => digits.includes(d);

        const grid = Grid.loadFromStrings<string>(lines);

        const isPartNumber = (numStr: string, [xOrigin, yOrigin]: Vector2D): boolean => {
            for (let xOffset = 0; xOffset < numStr.length; xOffset += 1) {
                // for each digit in the number, compute adjacent points and check for an adjacent symbol

                // console.log(
                //     `checking digit ${numStr.at(xOffset)} at point ${xOrigin + xOffset},${yOrigin}`
                // );
                for (const adjacentPoint of [
                    ...grid.adjacentPointGenerator([xOrigin + xOffset, yOrigin]),
                ]) {
                    const value = grid.getValue(adjacentPoint);
                    // console.log(`adjacent point ${adjacentPoint} has value ${value}`);
                    if (!isDigit(value) && value !== '.') {
                        // if the adjacent cell is not a digit and not a ',' then it must be a symbol
                        // bail out immediately and return true
                        // console.log(`found symbol!`);
                        return true;
                    }
                }
            }

            return false;
        };

        let accumulator: number = 0;

        lines
            // .slice(0, 1)
            .forEach((line, yIndex) => {
                const matches = [...line.matchAll(/\d+/gm)];

                matches.forEach((match) => {
                    const numStr = match[0];
                    const xIndex = match.index ?? -1;

                    // console.log(numStr, xIndex);
                    if (isPartNumber(numStr, [xIndex, yIndex])) {
                        // console.log(`${numStr} IS a part number`);
                        accumulator += parseInt(numStr);
                    }
                });

                // console.log([...matches]);

                return;
            });
        return accumulator.toString();
    }

    public solvePart2(lines: Input): string {
        return '';
    }
}
