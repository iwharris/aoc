import { Grid, Point } from '../util/grid';
import { BaseSolution, Input } from '../solution';

export class Solution extends BaseSolution {
    description = `
    --- Day 6: Chronal Coordinates ---
    The device on your wrist beeps several times, and once again you feel like you're falling.
    
    "Situation critical," the device announces. "Destination indeterminate. Chronal interference detected. Please specify new target
    coordinates."
    
    The device then produces a list of coordinates (your puzzle input). Are they places it thinks are safe or dangerous? It recommends you check
    manual page 729. The Elves did not give you a manual.
    
    If they're dangerous, maybe you can minimize the danger by finding the coordinate that gives the largest distance from the other points.
    
    Using only the Manhattan distance, determine the area around each coordinate by counting the number of integer X,Y locations that are
    closest to that coordinate (and aren't tied in distance to any other coordinate).
    
    Your goal is to find the size of the largest area that isn't infinite. For example, consider the following list of coordinates:
    
    1, 1
    1, 6
    8, 3
    3, 4
    5, 5
    8, 9
    If we name these coordinates A through F, we can draw them on a grid, putting 0,0 at the top left:
    
    ..........
    .A........
    ..........
    ........C.
    ...D......
    .....E....
    .B........
    ..........
    ..........
    ........F.
    This view is partial - the actual grid extends infinitely in all directions. Using the Manhattan distance, each location's closest
    coordinate can be determined, shown here in lowercase:
    
    aaaaa.cccc
    aAaaa.cccc
    aaaddecccc
    aadddeccCc
    ..dDdeeccc
    bb.deEeecc
    bBb.eeee..
    bbb.eeefff
    bbb.eeffff
    bbb.ffffFf
    Locations shown as . are equally far from two or more coordinates, and so they don't count as being closest to any.
    
    In this example, the areas of coordinates A, B, C, and F are infinite - while not shown here, their areas extend forever outside the visible
    grid. However, the areas of coordinates D and E are finite: D is closest to 9 locations, and E is closest to 17 (both including the
    coordinate's location itself). Therefore, in this example, the size of the largest area is 17.
    
    What is the size of the largest area that isn't infinite?
    
    
    --- Part Two ---
    On the other hand, if the coordinates are safe, maybe the best you can do is try to find a region near as many coordinates as possible.
    
    For example, suppose you want the sum of the Manhattan distance to all of the coordinates to be less than 32. For each location, add up the
    distances to all of the given coordinates; if the total of those distances is less than 32, that location is within the desired region.
    Using the same coordinates as above, the resulting region looks like this:
    
    ..........
    .A........
    ..........
    ...###..C.
    ..#D###...
    ..###E#...
    .B.###....
    ..........
    ..........
    ........F.
    In particular, consider the highlighted location 4,3 located at the top middle of the region. Its calculation is as follows, where abs() is
    the absolute value function:
    
    Distance to coordinate A: abs(4-1) + abs(3-1) =  5
    Distance to coordinate B: abs(4-1) + abs(3-6) =  6
    Distance to coordinate C: abs(4-8) + abs(3-3) =  4
    Distance to coordinate D: abs(4-3) + abs(3-4) =  2
    Distance to coordinate E: abs(4-5) + abs(3-5) =  3
    Distance to coordinate F: abs(4-8) + abs(3-9) = 10
    Total distance: 5 + 6 + 4 + 2 + 3 + 10 = 30
    Because the total distance to all coordinates (30) is less than 32, the location is within the region.
    
    This region, which also includes coordinates D and E, has a total size of 16.
    
    Your actual region will need to be much larger than this example, though, instead including all locations with a total distance of less than
    10000.
    
    What is the size of the region containing all locations which have a total distance to all given coordinates of less than 10000?`;

    solvePart1(lines: Input): string {
        const coords = lines.map(parseCoordinate);
        const [maxX, maxY] = computeLargestPoints(coords);

        const grid = new Grid<number>(maxX + 1, maxY + 1);

        // For every grid point, calculate closest coord using manhattan distance
        // Points of equal distance between two or more coords are disqualified

        populateCellDistancesToCoords(grid, coords);

        // At this point, each grid cell is populated with the id of the nearest coord, or -1 if the cell is disqualified.
        // Now, build a list of disqualified coordinates if their area touches the edges of the grid.

        const disqualified = computeDisqualifiedCoordinates(grid);
        const aggregatedAreas = aggregateCoordinates(grid);

        const eligibleCoords = aggregatedAreas
            .filter((c) => !disqualified.includes(c.id))
            .sort((c1, c2) => c2.area - c1.area);

        const [coord] = eligibleCoords.slice(0, 1);

        const result = coord.area;

        return Number(result).toString();
    }

    solvePart2(lines: Input, threshold = 10000): string {
        const coords = lines.map(parseCoordinate);
        const [maxX, maxY] = computeLargestPoints(coords);

        const grid = new Grid<number>(maxX + 1, maxY + 1);

        populateCellsWithinDistanceOfCoords(grid, coords, threshold);

        // Count cells with a truthy value (ie they are within the region)
        const result = grid.reduce(
            (count: number, currentIndex: number) => (currentIndex ? count + 1 : count),
            0
        );

        return Number(result).toString();
    }
}
type GridType = Grid<number>;

function parseCoordinate(line: string): Point {
    const [x, y] = line.split(', ');
    return [Number(x), Number(y)];
}

function computeLargestPoints(coords: Point[]) {
    return coords.reduce(([mx, my], [x, y]) => [Math.max(mx, x), Math.max(my, y)], [0, 0]);
}

function computeManhattanDistance([x1, y1], [x2, y2]) {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function populateCellDistancesToCoords(g: GridType, coords: Point[]): void {
    const grid = g;
    const gridPointGenerator = grid.rectPointGenerator(0, 0, grid.width, grid.height);

    let gridPoint = gridPointGenerator.next();
    while (!gridPoint.done) {
        const point = gridPoint.value;

        const distances = coords
            .map((coord, id) => ({ id, distance: computeManhattanDistance(point, coord) }))
            .sort((p1, p2) => p1.distance - p2.distance);

        const shortestDistance = distances[0].distance;
        const isTied = distances.filter((d) => d.distance === shortestDistance).length > 1;

        // Ties are disqualified
        if (isTied) {
            grid.set(gridPoint.value, -1);
        } else {
            grid.set(gridPoint.value, distances[0].id);
        }
        gridPoint = gridPointGenerator.next();
    }
}

function populateCellsWithinDistanceOfCoords(
    g: GridType,
    coords: Point[],
    distanceThreshold: number
) {
    const grid = g;
    const gridPointGenerator = grid.rectPointGenerator(0, 0, grid.width, grid.height);

    let gridPoint = gridPointGenerator.next();
    while (!gridPoint.done) {
        const point = gridPoint.value;

        const totalDistanceToAllCoords = coords
            .map((coord) => computeManhattanDistance(point, coord)) // get distance to each coord
            .reduce((totalDistance, currentDistance) => totalDistance + currentDistance, 0); // sum distances

        if (totalDistanceToAllCoords < distanceThreshold) {
            grid.set(gridPoint.value, totalDistanceToAllCoords);
        }

        gridPoint = gridPointGenerator.next();
    }
}

function computeDisqualifiedCoordinates(grid: GridType): number[] {
    const disqualified = {};

    const gridEdgePointGenerator = grid.edgePointGenerator();
    let edgePoint = gridEdgePointGenerator.next();
    while (!edgePoint.done) {
        const coordId = grid.getValue(edgePoint.value);
        if (coordId >= 0) {
            disqualified[coordId] = true;
        }
        edgePoint = gridEdgePointGenerator.next();
    }

    return Object.keys(disqualified).map(Number);
}

function aggregateCoordinates(grid: GridType): any[] {
    return Object.values(
        grid.reduce((counts: any, closestCoordId: number) => {
            const c = counts;
            if (closestCoordId >= 0) {
                if (!c[closestCoordId]) {
                    c[closestCoordId] = { id: closestCoordId, area: 0 };
                }
                c[closestCoordId].area += 1;
            }

            return c;
        }, {})
    );
}
