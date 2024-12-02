import { BaseSolution } from '../solution';
import { Input } from '../types';

type Report = number[];

const parseInput = (lines: Input) =>
    lines.map((line) => line.split(' ').map((int) => parseInt(int)));

const isSafe = (report: Report) => {
    let prevValue = report[0];

    if (report[0] === report[1]) {
        return false;
    }
    const trend: 'increasing' | 'decreasing' = report[1] > report[0] ? 'increasing' : 'decreasing';

    for (const value of report.slice(1)) {
        const diff = value - prevValue;
        if ((diff > 0 && trend === 'decreasing') || (diff < 0 && trend === 'increasing')) {
            return false;
        }
        const absDiff = Math.abs(diff);
        if (absDiff < 1 || absDiff > 3) {
            // not in range
            return false;
        }
        prevValue = value;
    }

    // success
    return true;
};

export class Solution extends BaseSolution {
    description = ``;

    public solvePart1(lines: Input): string {
        const reports = parseInput(lines);

        // console.log(reports);
        return reports
            .filter((report) => {
                const safe = isSafe(report);
                // console.log(`${report}: ${safe}`);
                return safe;
            })
            .length.toString();
    }

    public solvePart2(lines: Input): string {
        const reports = parseInput(lines);

        return (
            reports
                // .slice(0, 1)
                .filter((report) => {
                    // try removing each element of the report
                    const variants = [
                        report,
                        ...report.map((_, index) => {
                            const v = [...report];
                            v.splice(index, 1);
                            return v;
                        }),
                    ];
                    // console.log('all variants', variants);

                    return variants.some((variant) => isSafe(variant));
                })
                .length.toString()
        );
        return '';
    }
}
