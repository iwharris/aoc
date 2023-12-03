import { BaseSolution } from '../solution';
import { Input } from '../types';
import { product, sum } from '../util/fp';
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
    
    --- Part Two ---

    The engineer finds the missing part and installs it in the engine! As the engine springs to life, you jump in the closest gondola, finally ready to ascend to the water source.
    
    You don't seem to be going very fast, though. Maybe something is still wrong? Fortunately, the gondola has a phone labeled "help", so you pick it up and the engineer answers.
    
    Before you can explain the situation, she suggests that you look out the window. There stands the engineer, holding a phone in one hand and waving with the other. You're going so slowly that you haven't even left the station. You exit the gondola.
    
    The missing part wasn't the only issue - one of the gears in the engine is wrong. A gear is any * symbol that is adjacent to exactly two part numbers. Its gear ratio is the result of multiplying those two numbers together.
    
    This time, you need to find the gear ratio of every gear and add them all up so that the engineer can figure out which gear needs to be replaced.
    
    Consider the same engine schematic again:
    
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
    
    In this schematic, there are two gears. The first is in the top left; it has part numbers 467 and 35, so its gear ratio is 16345. The second gear is in the lower right; its gear ratio is 451490. (The * adjacent to 617 is not a gear because it is only adjacent to one part number.) Adding up all of the gear ratios produces 467835.
    
    What is the sum of all of the gear ratios in your engine schematic?
    
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
        const grid = Grid.loadFromStrings<string>(lines);

        // Reverse lookup used to find unique part numbers next to each gaer
        const pointToNumberId: Record<string, { id: number; num: number }> = {};

        let curId = 0;
        const getId = (): number => {
            curId += 1;
            return curId;
        };

        lines
            // .slice(0, 1)
            .forEach((line, yIndex) => {
                const matches = [...line.matchAll(/\d+/gm)];

                matches.forEach((match) => {
                    const numStr = match[0];
                    const xIndex = match.index ?? -1;

                    const id = getId();
                    const num = parseInt(numStr);

                    numStr.split('').forEach((_digit, offset) => {
                        const point: Vector2D = [xIndex + offset, yIndex];
                        if (
                            [...grid.adjacentPointGenerator(point)].some(
                                (point) => grid.getValue(point) === '*'
                            )
                        ) {
                            // Add cell entry to lookup table (small optimization so we don't store lookups for digits that aren't adjacent to a gear)
                            pointToNumberId[point.toString()] = { id, num };
                        }
                    });
                });

                // console.log([...matches]);

                return;
            });

        // console.log(pointToNumberId);

        let accumulator: number = 0;

        grid.forEach((value, idx) => {
            if (value === '*') {
                const point = grid.getPointFromIndex(idx);
                const adjacentHits = [...grid.adjacentPointGenerator(point)]
                    .map((adjacentPoint) => pointToNumberId[adjacentPoint.toString()])
                    .filter(Boolean);

                const uniqueAdjacentIds = new Set<number>(adjacentHits.map((h) => h.id));
                if (uniqueAdjacentIds.size === 2) {
                    // Found a gear
                    const partNumbers = [...uniqueAdjacentIds].map(
                        (id) => adjacentHits.find((hit) => hit.id === id)?.num ?? 0
                    );
                    accumulator += product(partNumbers);
                }

                // console.log(uniqueAdjacentIds);
            }
        }, grid);
        return accumulator.toString();
    }
}
