import { BaseSolution } from '../solution';
import { Input } from '../types';
import { Grid, Vector2D, isEqual } from '../util/grid';

export class Solution extends BaseSolution {
    preserveEmptyLines = true;

    description = `

    `;

    public solvePart1(lines: Input): string {
        const grid = Grid.loadFromStrings<Tile>(lines);
        tilt(grid, 'N');

        // console.log(grid.toString());

        return calculateLoad(grid).toString();
    }

    public solvePart2(lines: Input): string {
        const iterationTarget = 1000000000;
        const grid = Grid.loadFromStrings<Tile>(lines);
        const history: string[] = []; // save the initial state in history
        for (let i = 0; i < iterationTarget; i++) {
            for (const direction of ['N', 'W', 'S', 'E']) {
                tilt(grid, direction as TiltDirection);
            }
            const newState = grid.toString();
            if (history.includes(newState)) {
                const firstIndex = history.findIndex((v) => v === newState);
                const cycleLength = i - firstIndex;

                // console.log(`at i=${i}, found match in history at ${firstIndex}`);
                // Extrapolate to iteration limit
                // console.log(`there is a cycle every ${cycleLength} cycles`);

                const extrapolatedIndex =
                    ((iterationTarget - firstIndex) % cycleLength) + firstIndex - 1;
                // console.log(
                //     `iteration ${iterationTarget} corresponds to index ${extrapolatedIndex}`
                // );
                const gridAtExtrapolated = Grid.loadFromStrings(
                    history[extrapolatedIndex].trim().split('\n')
                );

                return calculateLoad(gridAtExtrapolated).toString();
            }

            history.push(grid.toString());
        }
        throw new Error('No cycle');
    }
}

type Tile = '#' | 'O' | '.';
type TiltDirection = 'N' | 'E' | 'S' | 'W';

const TILT_TO_ITER_DIR: Record<TiltDirection, 'up' | 'down' | 'left' | 'right'> = {
    W: 'right',
    E: 'left',
    N: 'down',
    S: 'up',
};

const DIR_TO_SLOPE: Record<TiltDirection, Vector2D> = {
    W: [-1, 0],
    E: [1, 0],
    S: [0, 1],
    N: [0, -1],
};

const tilt = (grid: Grid<Tile>, direction: TiltDirection): void => {
    for (const originPt of grid.pointGenerator({ direction: TILT_TO_ITER_DIR[direction] })) {
        const val = grid.getValue(originPt);
        if (val === 'O') {
            let destPt = originPt;
            for (const p of grid.linePointGenerator(DIR_TO_SLOPE[direction], originPt, {
                excludeOrigin: true,
            })) {
                if (grid.getValue(p) === 'O' || grid.getValue(p) === '#') break;
                destPt = p;
            }
            if (!isEqual(originPt, destPt)) {
                grid.set(originPt, '.');
                grid.set(destPt, 'O');
            }
        }
    }
};

const calculateLoad = (grid: Grid<Tile>): number => {
    let load = 0;
    for (const pt of grid.pointGenerator()) {
        const val = grid.getValue(pt);
        if (val === 'O') load += grid.height - pt[1];
    }
    return load;
};
