import { BaseSolution, Input } from '../solution';
import { Grid, Vector2D } from '../util/grid';

export class Solution extends BaseSolution {
    public description = `
    --- Day 11: Seating System ---

    Your plane lands with plenty of time to spare. The final leg of your journey is a ferry that goes directly to the tropical island where you can finally start your vacation. As you reach the waiting area to board the ferry, you realize you're so early, nobody else has even arrived yet!

    By modeling the process people use to choose (or abandon) their seat in the waiting area, you're pretty sure you can predict the best place to sit. You make a quick map of the seat layout (your puzzle input).

    The seat layout fits neatly on a grid. Each position is either floor (.), an empty seat (L), or an occupied seat (#). For example, the initial seat layout might look like this:

    L.LL.LL.LL
    LLLLLLL.LL
    L.L.L..L..
    LLLL.LL.LL
    L.LL.LL.LL
    L.LLLLL.LL
    ..L.L.....
    LLLLLLLLLL
    L.LLLLLL.L
    L.LLLLL.LL
    Now, you just need to model the people who will be arriving shortly. Fortunately, people are entirely predictable and always follow a simple set of rules. All decisions are based on the number of occupied seats adjacent to a given seat (one of the eight positions immediately up, down, left, right, or diagonal from the seat). The following rules are applied to every seat simultaneously:

    If a seat is empty (L) and there are no occupied seats adjacent to it, the seat becomes occupied.
    If a seat is occupied (#) and four or more seats adjacent to it are also occupied, the seat becomes empty.
    Otherwise, the seat's state does not change.
    Floor (.) never changes; seats don't move, and nobody sits on the floor.

    After one round of these rules, every seat in the example layout becomes occupied:

    #.##.##.##
    #######.##
    #.#.#..#..
    ####.##.##
    #.##.##.##
    #.#####.##
    ..#.#.....
    ##########
    #.######.#
    #.#####.##
    After a second round, the seats with four or more occupied adjacent seats become empty again:

    #.LL.L#.##
    #LLLLLL.L#
    L.L.L..L..
    #LLL.LL.L#
    #.LL.LL.LL
    #.LLLL#.##
    ..L.L.....
    #LLLLLLLL#
    #.LLLLLL.L
    #.#LLLL.##
    This process continues for three more rounds:

    #.##.L#.##
    #L###LL.L#
    L.#.#..#..
    #L##.##.L#
    #.##.LL.LL
    #.###L#.##
    ..#.#.....
    #L######L#
    #.LL###L.L
    #.#L###.##
    #.#L.L#.##
    #LLL#LL.L#
    L.L.L..#..
    #LLL.##.L#
    #.LL.LL.LL
    #.LL#L#.##
    ..L.L.....
    #L#LLLL#L#
    #.LLLLLL.L
    #.#L#L#.##
    #.#L.L#.##
    #LLL#LL.L#
    L.#.L..#..
    #L##.##.L#
    #.#L.LL.LL
    #.#L#L#.##
    ..L.L.....
    #L#L##L#L#
    #.LLLLLL.L
    #.#L#L#.##
    At this point, something interesting happens: the chaos stabilizes and further applications of these rules cause no seats to change state! Once people stop moving around, you count 37 occupied seats.

    Simulate your seating area by applying the seating rules repeatedly until no seats change state. How many seats end up occupied?

    --- Part Two ---

    As soon as people start to arrive, you realize your mistake. People don't just care about adjacent seats - they care about the first seat they can see in each of those eight directions!

    Now, instead of considering just the eight immediately adjacent seats, consider the first seat in each of those eight directions. For example, the empty seat below would see eight occupied seats:

    .......#.
    ...#.....
    .#.......
    .........
    ..#L....#
    ....#....
    .........
    #........
    ...#.....
    The leftmost empty seat below would only see one empty seat, but cannot see any of the occupied ones:

    .............
    .L.L.#.#.#.#.
    .............
    The empty seat below would see no occupied seats:

    .##.##.
    #.#.#.#
    ##...##
    ...L...
    ##...##
    #.#.#.#
    .##.##.
    Also, people seem to be more tolerant than you expected: it now takes five or more visible occupied seats for an occupied seat to become empty (rather than four or more from the previous rules). The other rules still apply: empty seats that see no occupied seats become occupied, seats matching no rule don't change, and floor never changes.

    Given the same starting layout as above, these new rules cause the seating area to shift around as follows:

    L.LL.LL.LL
    LLLLLLL.LL
    L.L.L..L..
    LLLL.LL.LL
    L.LL.LL.LL
    L.LLLLL.LL
    ..L.L.....
    LLLLLLLLLL
    L.LLLLLL.L
    L.LLLLL.LL
    #.##.##.##
    #######.##
    #.#.#..#..
    ####.##.##
    #.##.##.##
    #.#####.##
    ..#.#.....
    ##########
    #.######.#
    #.#####.##
    #.LL.LL.L#
    #LLLLLL.LL
    L.L.L..L..
    LLLL.LL.LL
    L.LL.LL.LL
    L.LLLLL.LL
    ..L.L.....
    LLLLLLLLL#
    #.LLLLLL.L
    #.LLLLL.L#
    #.L#.##.L#
    #L#####.LL
    L.#.#..#..
    ##L#.##.##
    #.##.#L.##
    #.#####.#L
    ..#.#.....
    LLL####LL#
    #.L#####.L
    #.L####.L#
    #.L#.L#.L#
    #LLLLLL.LL
    L.L.L..#..
    ##LL.LL.L#
    L.LL.LL.L#
    #.LLLLL.LL
    ..L.L.....
    LLLLLLLLL#
    #.LLLLL#.L
    #.L#LL#.L#
    #.L#.L#.L#
    #LLLLLL.LL
    L.L.L..#..
    ##L#.#L.L#
    L.L#.#L.L#
    #.L####.LL
    ..#.#.....
    LLL###LLL#
    #.LLLLL#.L
    #.L#LL#.L#
    #.L#.L#.L#
    #LLLLLL.LL
    L.L.L..#..
    ##L#.#L.L#
    L.L#.LL.L#
    #.LLLL#.LL
    ..#.L.....
    LLL###LLL#
    #.LLLLL#.L
    #.L#LL#.L#

    Again, at this point, people stop shifting around and the seating area reaches equilibrium. Once this occurs, you count 26 occupied seats.

    Given the new visibility method and the rule change for occupied seats becoming empty, once equilibrium is reached, how many seats end up occupied?
    `;

    solvePart1(lines: Input): string {
        const grid = Grid.loadFromStrings<Seat>(lines, (char) => stringToSeatValue[char]);

        const step = (): boolean => {
            let changed = false;
            // compute adjacency grid
            const adjacencyGrid = grid.map<number>((seatValue, pt) => {
                if (seatValue === Seat.EMPTY || seatValue === Seat.OCCUPIED) {
                    return Array.from(grid.adjacentPointGenerator(pt)).filter(
                        (p) => grid.getValue(p) === Seat.OCCUPIED
                    ).length;
                }
                return 0;
            });

            for (const point of grid.pointGenerator()) {
                const seatValue = grid.getValue(point);
                if (seatValue === Seat.FLOOR) {
                    continue;
                } else {
                    const adjacentOccupiedSeats = adjacencyGrid.getValue(point);
                    if (seatValue === Seat.EMPTY && adjacentOccupiedSeats === 0) {
                        changed = true;
                        grid.set(point, Seat.OCCUPIED);
                        // console.log(`changed [${px}, ${py}] from ${seatValue} to ${Seat.OCCUPIED}`);
                    } else if (seatValue === Seat.OCCUPIED && adjacentOccupiedSeats > 3) {
                        changed = true;
                        grid.set(point, Seat.EMPTY);
                        // console.log(`changed [${px}, ${py}] from ${seatValue} to ${Seat.EMPTY}`);
                    }
                }
            }
            // console.log(`changed: ${changed}`);
            return changed;
        };

        // let iterations = 0;
        while (step()) {
            // iterations += 1;
        }
        // console.log(`finished after ${iterations} iterations`);

        const occupied = grid.grid.filter((v) => v === Seat.OCCUPIED).length;
        return occupied.toString();
    }

    solvePart2(lines: Input): string {
        const grid = Grid.loadFromStrings<Seat>(lines, (char) => stringToSeatValue[char]);

        const step = (): boolean => {
            let changed = false;
            // compute adjacency grid
            const visibilityGrid = grid.map<number>((seatValue, origin) => {
                if (seatValue === Seat.EMPTY || seatValue === Seat.OCCUPIED) {
                    // compute visibility to occupied seats by looking in the eight cardinal directions
                    const viewAngles: Vector2D[] = [
                        [-1, -1], // northwest
                        [0, -1], // north
                        [1, -1], // northeast
                        [-1, 0], // west
                        [1, 0], // east
                        [-1, 1], // southwest
                        [0, 1], // south
                        [1, 1], // southeast
                    ];

                    return viewAngles.filter((angle) => {
                        for (const point of grid.linePointGenerator(angle, origin, {
                            excludeOrigin: true,
                        })) {
                            // if (!grid.isInBounds(vx, vy)) return false;
                            const val = grid.getValue(point);
                            if (val === Seat.FLOOR) continue;
                            else {
                                // console.log(
                                //     `checking visibility at point ${vx}, ${vy} from ${origin}`
                                // );
                                if (val === Seat.EMPTY) return false;
                                else if (val === Seat.OCCUPIED) return true;
                            }
                        }
                        return false;
                    }).length;
                }
                return 0;
            });

            for (const point of grid.pointGenerator()) {
                const seatValue = grid.getValue(point);
                if (seatValue === Seat.FLOOR) {
                    continue;
                } else {
                    const visibleOccupiedSeats = visibilityGrid.getValue(point);
                    if (seatValue === Seat.EMPTY && visibleOccupiedSeats === 0) {
                        changed = true;
                        grid.set(point, Seat.OCCUPIED);
                        // console.log(`changed [${px}, ${py}] from ${seatValue} to ${Seat.OCCUPIED}`);
                    } else if (seatValue === Seat.OCCUPIED && visibleOccupiedSeats > 4) {
                        changed = true;
                        grid.set(point, Seat.EMPTY);
                        // console.log(`changed [${px}, ${py}] from ${seatValue} to ${Seat.EMPTY}`);
                    }
                }
            }
            // console.log(`changed: ${changed}`);
            return changed;
        };

        while (step()) {}

        const occupied = grid.grid.filter((v) => v === Seat.OCCUPIED).length;
        return occupied.toString();
    }
}

enum Seat {
    FLOOR = -1,
    EMPTY = 0,
    OCCUPIED = 1,
}

const stringToSeatValue: Record<string, Seat> = {
    '.': Seat.FLOOR,
    L: Seat.EMPTY,
    '#': Seat.OCCUPIED,
};
