import { BaseSolution, type Input } from '../solution';
import { sum } from '../util/fp';
import { extractAllMatches } from '../util/regex';

type Machine = [number, number, number, number, number, number];

const parseMachine = (threeLines: string): Machine =>
    extractAllMatches(threeLines, /\d+/).map(Number) as Machine;

const getButtonPressesForMachine = ([ax, ay, bx, by, tx, ty]: Machine): [number, number] => {
    const ax_by = ax * by;
    const tx_by = tx * by;
    const ay_bx = ay * bx;
    const ty_bx = ty * bx;

    const a = (tx_by - ty_bx) / (ax_by - ay_bx);
    const b = (ty - ay * a) / by;

    return [a, b];
};

export class Solution extends BaseSolution {
    description = ``;

    preserveEmptyLines = true;

    public solvePart1(lines: Input): string {
        const machines = lines
            .join('\n')
            .split('\n\n')
            .map((threeLineString) => parseMachine(threeLineString));

        return sum(
            machines
                .map((m) => getButtonPressesForMachine(m))
                .filter(([a, b]) => {
                    // Only integers mean that there is a solution
                    return Number.isInteger(a) && Number.isInteger(b);
                })
                .map(([a, b]) => 3 * a + b)
        ).toString();
    }

    public solvePart2(lines: Input): string {
        const machines = lines
            .join('\n')
            .split('\n\n')
            .map((threeLineString) => {
                const [ax, ay, bx, by, tx, ty] = parseMachine(threeLineString);
                return [ax, ay, bx, by, tx + 10000000000000, ty + 10000000000000] as Machine;
            });

        return sum(
            machines
                .map((m) => getButtonPressesForMachine(m))
                .filter(([a, b]) => {
                    // Only integers mean that there is a solution
                    return Number.isInteger(a) && Number.isInteger(b);
                })
                .map(([a, b]) => 3 * a + b)
        ).toString();
    }
}

/*
Scratch

Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Calculating the number of button presses to get to the target X coord
  A*94 + B*22 === 8400
  A*34 + B*67 === 5400

We also know that A is the same in both equations. B is also the same

So the two equations equal each other:

Scale both equations by the B coefficient on the other so there is a constant B in both:

  First equation is 67*94*A + 67*22*B === 67*8400 which is 6298*A + 1474*B === 562800
  Secon equation is 22*34*A + 22*67*B === 22*5400 which is 748*A + 1474*B === 118800

First equation minus second equation:

  6298*A - 748*A + 1474*B - 1474*B === 562800 - 118800

Which simplifies to

  5550*A === 444000

Or 
  5550*A/5550 === 444000/5550
  A === 80

Now sub A into the equation to find B

*/
