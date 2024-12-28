import { BaseSolution } from '../solution';
import { Input } from '../types';
// import { sum } from '../util/fp';
import { CARDINAL_VECTORS, CardinalDirection } from '../util/grid';
import {
    // copyPoint,
    translatePoint,
} from '../util/point';
import { Point } from '../util/point';

export class Solution extends BaseSolution {
    description = ``;

    public solvePart1(lines: Input): string {
        const steps: [CardinalDirection, number][] = lines
            .map(parseLine)
            .map(([dir, string]) => [dir, string]);

        return solve(steps).toString();
    }

    public solvePart2(lines: Input): string {
        const steps: [CardinalDirection, number][] = lines.map(parseLine).map(([, , hex]) => {
            const dist = parseInt(hex.substring(0, 5), 16);
            const dirIndex = parseInt(hex[5]);

            const dir = ['E', 'S', 'W', 'N'][dirIndex] as CardinalDirection;
            return [dir, dist];
        });

        return solve(steps).toString();
    }
}

const parseLine = (line: string): [CardinalDirection, number, string] => {
    const DIR_TO_CARDINAL: Record<'U' | 'D' | 'L' | 'R', CardinalDirection> = {
        R: 'E',
        L: 'W',
        U: 'N',
        D: 'S',
    };
    const [, rawDir, rawDist, hex] = /^(\w)\s(\d+)\s\(#(\w+)\)$/m.exec(line) ?? [];
    return [DIR_TO_CARDINAL[rawDir], parseInt(rawDist), hex];
};

const solve = (steps: [CardinalDirection, number][]): number => {
    // const polygonArea = (pts: Point[]) => {
    //     // console.log(pts);
    //     let a = 0;
    //     let b = 0;
    //     for (let i = 0; i < pts.length; i++) {
    //         if (i === pts.length - 1) {
    //             a += pts[i][0] * pts[0][1];
    //             b += pts[0][0] * pts[i][1];
    //         } else {
    //             a += pts[i][0] * pts[i + 1][1];
    //             b += pts[i + 1][0] * pts[i][1];
    //         }
    //     }

    //     return Math.abs(a - b) / 2;
    // };

    let perimeter = 0;
    let area = 0;
    const currentPoint: Point = [0, 0];

    // Using green's theorem - simpler than using pick's theorem and shoelace formula
    for (const [dir, dist] of steps) {
        translatePoint(currentPoint, CARDINAL_VECTORS[dir], dist);
        perimeter += dist;
        area += currentPoint[0] * CARDINAL_VECTORS[dir][1] * dist;
    }

    return area + perimeter / 2 + 1;

    // Using pick's theorem plus shoelace formula
    // const points: Point[] = [copyPoint(currentPoint)];
    // for (const [dir, dist] of steps) {
    //     translatePoint(currentPoint, CARDINAL_VECTORS[dir], dist);
    //     points.push(copyPoint(currentPoint));
    //     perimeter += dist;
    // }
    // area = polygonArea(points);

    // console.log('Inner area', area);
    // console.log('Perimeter', perimeter);
    // console.log('total area', )

    // return (area + 1 + perimeter / 2).toString();
};
