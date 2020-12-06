import { Grid } from '../util/grid';
import { BaseSolution, Input } from '../solution';

export class Solution extends BaseSolution {
    description = `
    --- Day 3: No Matter How You Slice It ---
    The Elves managed to locate the chimney-squeeze prototype fabric for Santa's suit (thanks to someone who helpfully wrote its box IDs on the
      wall of the warehouse in the middle of the night). Unfortunately, anomalies are still affecting them - nobody can even agree on how to cut
      the fabric.
    
    The whole piece of fabric they're working on is a very large square - at least 1000 inches on each side.
    
    Each Elf has made a claim about which area of fabric would be ideal for Santa's suit. All claims have an ID and consist of a single
    rectangle with edges parallel to the edges of the fabric. Each claim's rectangle is defined as follows:
    
    The number of inches between the left edge of the fabric and the left edge of the rectangle.
    The number of inches between the top edge of the fabric and the top edge of the rectangle.
    The width of the rectangle in inches.
    The height of the rectangle in inches.
    A claim like #123 @ 3,2: 5x4 means that claim ID 123 specifies a rectangle 3 inches from the left edge, 2 inches from the top edge, 5 inches
    wide, and 4 inches tall. Visually, it claims the square inches of fabric represented by # (and ignores the square inches of fabric
      represented by .) in the diagram below:
    
    ...........
    ...........
    ...#####...
    ...#####...
    ...#####...
    ...#####...
    ...........
    ...........
    ...........
    The problem is that many of the claims overlap, causing two or more claims to cover part of the same areas. For example, consider the
    following claims:
    
    #1 @ 1,3: 4x4
    #2 @ 3,1: 4x4
    #3 @ 5,5: 2x2
    Visually, these claim the following areas:
    
    ........
    ...2222.
    ...2222.
    .11XX22.
    .11XX22.
    .111133.
    .111133.
    ........
    The four square inches marked with X are claimed by both 1 and 2. (Claim 3, while adjacent to the others, does not overlap either of them.)
    
    If the Elves all proceed with their own plans, none of them will have enough fabric. How many square inches of fabric are within two or more
    claims?
    
    
    --- Part Two ---
    Amidst the chaos, you notice that exactly one claim doesn't overlap by even a single square inch of fabric with any other claim. If you can
    somehow draw attention to it, maybe the Elves will be able to make Santa's suit after all!
    
    For example, in the claims above, only claim 3 is intact after all claims are made.
    
    What is the ID of the only claim that doesn't overlap?`;

    solvePart1(lines: Input): string {
        const claims = parseLines(lines);
        const { maxX: width, maxY: height } = computeGridSize(claims);
        const grid = new Grid(width + 1, height + 1, 0);
        markClaimsOnGrid(grid, claims);
        const result = getNumberOfClaimedPoints(grid, 2);

        return result.toString();
    }

    solvePart2(lines: Input): string {
        const claims = parseLines(lines);
        const { maxX: w, maxY: h } = computeGridSize(claims);
        const grid = new Grid(w, h, 0);
        markClaimsOnGrid(grid, claims);

        let result;

        // for each claim, check that all grid tiles under the claim are staked by exactly 1 claim
        for (let i = 0; i < claims.length; i += 1) {
            const claim = claims[i];
            const { x, y, width, height } = claim;

            const gridPOintsGenerator = grid.rectIndexGenerator(x, y, width, height);

            let isUncontestedClaim = true;
            let point = gridPOintsGenerator.next();
            while (isUncontestedClaim && !point.done) {
                if (grid.grid[point.value] !== 1) {
                    isUncontestedClaim = false;
                }
                point = gridPOintsGenerator.next();
            }

            if (isUncontestedClaim) {
                // found it!
                result = claim.id;
                break;
            }
        }

        return result.toString();
    }
}

const parseRegex = /^#(\d+)\s@\s(\d+),(\d+):\s(\d+)x(\d+)$/;

function parseLines(lines) {
    return lines.map((line) => {
        const matches = parseRegex.exec(line) || [];
        matches.shift();
        const [id, x, y, width, height] = matches.slice(0, 5).map((n) => Number(n));
        return {
            id,
            x,
            y,
            width,
            height,
        };
    });
}

/**
 * Checks all claims to find maximum x-values (originX + width) and y-values (originY + height)
 * @param {Array} claims
 */
function computeGridSize(claims) {
    return claims.reduce(
        ({ maxX, maxY }, claim) => {
            const claimX = claim.x + claim.width;
            const claimY = claim.y + claim.height;

            return { maxX: Math.max(maxX, claimX), maxY: Math.max(maxY, claimY) };
        },
        { maxX: 0, maxY: 0 }
    );
}

function markClaimsOnGrid(gridObject, claims) {
    const grid = gridObject;
    claims.forEach((claim) => {
        const { x, y, width, height } = claim;

        const gridPointsGenerator = grid.rectIndexGenerator(x, y, width, height);
        let point = gridPointsGenerator.next();

        while (!point.done) {
            grid.grid[point.value] += 1;
            point = gridPointsGenerator.next();
        }
    });

    return grid;
}

function getNumberOfClaimedPoints(grid, threshold): number {
    return grid.reduce((acc, cellValue) => (cellValue >= threshold ? acc + 1 : acc), 0);
}
