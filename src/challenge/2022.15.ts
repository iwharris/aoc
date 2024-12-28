import { assert } from 'console';
import { BaseSolution } from '../solution';
import { Input } from '../types';
import { Point } from '../util/point';
import { manhattanDistance } from '../util/point';

export class Solution extends BaseSolution {
    description = `
    --- Day 15: Beacon Exclusion Zone ---
    You feel the ground rumble again as the distress signal leads you to a large network of subterranean tunnels. You don't have time to search them all, but you don't need to: your pack contains a set of deployable sensors that you imagine were originally built to locate lost Elves.
    
    The sensors aren't very powerful, but that's okay; your handheld device indicates that you're close enough to the source of the distress signal to use them. You pull the emergency sensor system out of your pack, hit the big button on top, and the sensors zoom off down the tunnels.
    
    Once a sensor finds a spot it thinks will give it a good reading, it attaches itself to a hard surface and begins monitoring for the nearest signal source beacon. Sensors and beacons always exist at integer coordinates. Each sensor knows its own position and can determine the position of a beacon precisely; however, sensors can only lock on to the one beacon closest to the sensor as measured by the Manhattan distance. (There is never a tie where two beacons are the same distance to a sensor.)
    
    It doesn't take long for the sensors to report back their positions and closest beacons (your puzzle input). For example:
    
    Sensor at x=2, y=18: closest beacon is at x=-2, y=15
    Sensor at x=9, y=16: closest beacon is at x=10, y=16
    Sensor at x=13, y=2: closest beacon is at x=15, y=3
    Sensor at x=12, y=14: closest beacon is at x=10, y=16
    Sensor at x=10, y=20: closest beacon is at x=10, y=16
    Sensor at x=14, y=17: closest beacon is at x=10, y=16
    Sensor at x=8, y=7: closest beacon is at x=2, y=10
    Sensor at x=2, y=0: closest beacon is at x=2, y=10
    Sensor at x=0, y=11: closest beacon is at x=2, y=10
    Sensor at x=20, y=14: closest beacon is at x=25, y=17
    Sensor at x=17, y=20: closest beacon is at x=21, y=22
    Sensor at x=16, y=7: closest beacon is at x=15, y=3
    Sensor at x=14, y=3: closest beacon is at x=15, y=3
    Sensor at x=20, y=1: closest beacon is at x=15, y=3
    So, consider the sensor at 2,18; the closest beacon to it is at -2,15. For the sensor at 9,16, the closest beacon to it is at 10,16.
    
    Drawing sensors as S and beacons as B, the above arrangement of sensors and beacons looks like this:
    
                   1    1    2    2
         0    5    0    5    0    5
     0 ....S.......................
     1 ......................S.....
     2 ...............S............
     3 ................SB..........
     4 ............................
     5 ............................
     6 ............................
     7 ..........S.......S.........
     8 ............................
     9 ............................
    10 ....B.......................
    11 ..S.........................
    12 ............................
    13 ............................
    14 ..............S.......S.....
    15 B...........................
    16 ...........SB...............
    17 ................S..........B
    18 ....S.......................
    19 ............................
    20 ............S......S........
    21 ............................
    22 .......................B....
    This isn't necessarily a comprehensive map of all beacons in the area, though. Because each sensor only identifies its closest beacon, if a sensor detects a beacon, you know there are no other beacons that close or closer to that sensor. There could still be beacons that just happen to not be the closest beacon to any sensor. Consider the sensor at 8,7:
    
                   1    1    2    2
         0    5    0    5    0    5
    -2 ..........#.................
    -1 .........###................
     0 ....S...#####...............
     1 .......#######........S.....
     2 ......#########S............
     3 .....###########SB..........
     4 ....#############...........
     5 ...###############..........
     6 ..#################.........
     7 .#########S#######S#........
     8 ..#################.........
     9 ...###############..........
    10 ....B############...........
    11 ..S..###########............
    12 ......#########.............
    13 .......#######..............
    14 ........#####.S.......S.....
    15 B........###................
    16 ..........#SB...............
    17 ................S..........B
    18 ....S.......................
    19 ............................
    20 ............S......S........
    21 ............................
    22 .......................B....
    This sensor's closest beacon is at 2,10, and so you know there are no beacons that close or closer (in any positions marked #).
    
    None of the detected beacons seem to be producing the distress signal, so you'll need to work out where the distress beacon is by working out where it isn't. For now, keep things simple by counting the positions where a beacon cannot possibly be along just a single row.
    
    So, suppose you have an arrangement of beacons and sensors like in the example above and, just in the row where y=10, you'd like to count the number of positions a beacon cannot possibly exist. The coverage from all sensors near that row looks like this:
    
                     1    1    2    2
           0    5    0    5    0    5
     9 ...#########################...
    10 ..####B######################..
    11 .###S#############.###########.
    In this example, in the row where y=10, there are 26 positions where a beacon cannot be present.
    
    Consult the report from the sensors you just deployed. In the row where y=2000000, how many positions cannot contain a beacon?

    --- Part Two ---
    Your handheld device indicates that the distress signal is coming from a beacon nearby. The distress beacon is not detected by any sensor, but the distress beacon must have x and y coordinates each no lower than 0 and no larger than 4000000.
    
    To isolate the distress beacon's signal, you need to determine its tuning frequency, which can be found by multiplying its x coordinate by 4000000 and then adding its y coordinate.
    
    In the example above, the search space is smaller: instead, the x and y coordinates can each be at most 20. With this reduced search area, there is only a single position that could have a beacon: x=14, y=11. The tuning frequency for this distress beacon is 56000011.
    
    Find the only possible position for the distress beacon. What is its tuning frequency?
    `;

    public solvePart1(lines: Input): string {
        return calculateCoverage(lines, 2000000).toString();
    }

    public solvePart2(lines: Input): string {
        const point = findBeacon(lines, 4000000, 4000000);
        // const point = findBeacon(lines, 20, 20);

        // console.log(`found point at ${point}`);
        return (point[0] * 4000000 + point[1]).toString();
    }
}

const calculateCoverage = (lines: Input, row: number): number => {
    const beacons = new Set<string>();

    const sensors: [Point, number][] = lines.map((line) => {
        const [, sx, sy, bx, by] =
            /^Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)$/gm.exec(
                line
            ) ?? [];
        const sensor: Point = [parseInt(sx), parseInt(sy)];
        const beacon: Point = [parseInt(bx), parseInt(by)];
        beacons.add(JSON.stringify(beacon));
        const radius = manhattanDistance(sensor, beacon);
        return [sensor, radius];
    });

    // compute minX, maxX to bound the search for coverage

    let minX = Infinity;
    let maxX = -Infinity;

    sensors.forEach(([sensor, manhattanDistance]) => {
        maxX = Math.max(maxX, sensor[0] + manhattanDistance);
        minX = Math.min(minX, sensor[0] - manhattanDistance);
    });

    // console.log(minX, maxX);

    // console.log(sensors);

    let coveredPoints = 0;
    for (let x = minX; x < maxX; x++) {
        const currentPoint: Point = [x, row];
        if (beacons.has(JSON.stringify(currentPoint))) {
            // console.log('there is a beacon at', currentPoint);
            continue;
        }
        const isInRange = sensors.some(
            ([sensorPoint, sensorDistance]) =>
                manhattanDistance(currentPoint, sensorPoint) <= sensorDistance
        );

        if (isInRange) {
            coveredPoints += 1;
        }
    }

    return coveredPoints;
};

const findBeacon = (lines: Input, searchWidth: number, searchHeight: number): Point => {
    const beacons = new Set<string>();

    const sensors = lines
        .map((line) => {
            const [, sx, sy, bx, by] =
                /^Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)$/gm.exec(
                    line
                ) ?? [];
            const sensor: Point = [parseInt(sx), parseInt(sy)];
            const beacon: Point = [parseInt(bx), parseInt(by)];
            beacons.add(JSON.stringify(beacon));
            const radius = manhattanDistance(sensor, beacon);
            return [sensor, radius] as [Point, number];
        })
        .sort(([, dist1], [, dist2]) => dist2 - dist1); // sort sensors so highest coverage radius comes first

    // compute minX, maxX to bound the search for coverage
    let minX = Infinity;
    let maxX = -Infinity;

    sensors.forEach(([sensor, manhattanDistance]) => {
        maxX = Math.max(maxX, sensor[0] + manhattanDistance);
        minX = Math.min(minX, sensor[0] - manhattanDistance);
    });

    let skip = false;
    let sx = 0;
    let sy = 0;
    let dist = 0;
    for (let y = 0; y <= searchHeight; y += 1) {
        // if (y % 100000 === 0) console.log(`row ${y}`);
        for (let x = 0; x <= searchWidth; x += 1) {
            skip = false;

            for (let i = 0; i < sensors.length; i += 1) {
                // iterate through sensors
                sx = sensors[i][0][0];
                sy = sensors[i][0][1];
                dist = sensors[i][1];
                if (Math.abs(x - sx) + Math.abs(y - sy) <= dist) {
                    // console.log(`${[x, y]} is in range of ${[sx, sy]} (within ${dist})`);
                    // if we're in the coverage area of a sensor, figure out how wide the coverage is in this row
                    // and skip horizontally to the other side of the coverage area
                    skip = true;

                    const yDiff = Math.abs(y - sy);
                    // console.log(`yDiff=${yDiff}`);

                    const xDelta = sx - x;
                    // assert(xDelta >= 0, 'thing didnt work');

                    const xRadius = sensors[i][1] - yDiff;
                    // console.log(`xDiff=${xRadius}`);

                    // skip xDelta + xRadius to get to the end of the coverage area
                    x += xDelta + xRadius;
                    // console.log(`skipping to x=${x}`);

                    break;
                }
            }
            if (skip) continue;
            if (beacons.has(JSON.stringify([x, y]))) {
                // console.log('there is a beacon at', [x, y]);
                continue;
            }

            return [x, y];
        }
    }
    throw new Error('did not find it');
};
