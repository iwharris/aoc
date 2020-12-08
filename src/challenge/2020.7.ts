import { BaseSolution, Input } from '../solution';
import { sum } from '../util/fp';
import { DirectedGraph } from '../util/graph';

export class Solution extends BaseSolution {
    public description = `
    --- Day 7: Handy Haversacks ---

    You land at the regional airport in time for your next flight. In fact, it looks like you'll even have time to grab some food: all flights are currently delayed due to issues in luggage processing.

    Due to recent aviation regulations, many rules (your puzzle input) are being enforced about bags and their contents; bags must be color-coded and must contain specific quantities of other color-coded bags. Apparently, nobody responsible for these regulations considered how long they would take to enforce!

    For example, consider the following rules:

    light red bags contain 1 bright white bag, 2 muted yellow bags.
    dark orange bags contain 3 bright white bags, 4 muted yellow bags.
    bright white bags contain 1 shiny gold bag.
    muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.
    shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.
    dark olive bags contain 3 faded blue bags, 4 dotted black bags.
    vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.
    faded blue bags contain no other bags.
    dotted black bags contain no other bags.
    These rules specify the required contents for 9 bag types. In this example, every faded blue bag is empty, every vibrant plum bag contains 11 bags (5 faded blue and 6 dotted black), and so on.

    You have a shiny gold bag. If you wanted to carry it in at least one other bag, how many different bag colors would be valid for the outermost bag? (In other words: how many colors can, eventually, contain at least one shiny gold bag?)

    In the above rules, the following options would be available to you:

    A bright white bag, which can hold your shiny gold bag directly.
    A muted yellow bag, which can hold your shiny gold bag directly, plus some other bags.
    A dark orange bag, which can hold bright white and muted yellow bags, either of which could then hold your shiny gold bag.
    A light red bag, which can hold bright white and muted yellow bags, either of which could then hold your shiny gold bag.
    So, in this example, the number of bag colors that can eventually contain at least one shiny gold bag is 4.

    How many bag colors can eventually contain at least one shiny gold bag? (The list of rules is quite long; make sure you get all of it.)

    --- Part Two ---

    It's getting pretty expensive to fly these days - not because of ticket prices, but because of the ridiculous number of bags you need to buy!

    Consider again your shiny gold bag and the rules from the above example:

    faded blue bags contain 0 other bags.
    dotted black bags contain 0 other bags.
    vibrant plum bags contain 11 other bags: 5 faded blue bags and 6 dotted black bags.
    dark olive bags contain 7 other bags: 3 faded blue bags and 4 dotted black bags.
    So, a single shiny gold bag must contain 1 dark olive bag (and the 7 bags within it) plus 2 vibrant plum bags (and the 11 bags within each of those): 1 + 1*7 + 2 + 2*11 = 32 bags!

    Of course, the actual rules have a small chance of going several levels deeper than this example; be sure to count all of the bags, even if the nesting becomes topologically impractical!

    Here's another example:

    shiny gold bags contain 2 dark red bags.
    dark red bags contain 2 dark orange bags.
    dark orange bags contain 2 dark yellow bags.
    dark yellow bags contain 2 dark green bags.
    dark green bags contain 2 dark blue bags.
    dark blue bags contain 2 dark violet bags.
    dark violet bags contain no other bags.
    In this example, a single shiny gold bag must contain 126 other bags.

    How many individual bags are required inside your single shiny gold bag?
    `;

    solvePart1(lines: Input): string {
        const parsed = lines.map(parseLine).filter(Boolean);

        const graph = new DirectedGraph<string, null, number>();

        // populate vertices
        parsed.forEach((entry) => {
            graph.addVertex(entry.color, null);
            entry.children.forEach((child) => graph.addVertex(child.color, null));
        });

        // populate edges
        parsed.forEach((entry) => {
            entry.children.forEach((child) => {
                graph.addEdge(child.color, entry.color, child.count);
            });
        });

        const start = 'shiny gold';

        // traverse the graph starting from 'start'

        const visited: string[] = [];
        const traverse = (node: string): void => {
            if (!visited.includes(node)) {
                visited.push(node);
                graph.getNeighbors(node).forEach(traverse);
            }
        };

        traverse(start);

        // console.log(visited);

        return (visited.length - 1).toString();
    }

    solvePart2(lines: Input): string {
        const parsed = lines.map(parseLine).filter(Boolean);

        const graph = new DirectedGraph<string, null, number>();

        // populate vertices
        parsed.forEach((entry) => {
            graph.addVertex(entry.color, null);
            entry.children.forEach((child) => graph.addVertex(child.color, null));
        });

        // populate edges in the other direction
        parsed.forEach((entry) => {
            entry.children.forEach((child) => {
                graph.addEdge(entry.color, child.color, child.count);
            });
        });

        const visited = [] as any[];
        const traverse = (node: string): number => {
            // if (visited.includes(node)) return 0;
            visited.push(node);
            // console.log(`visit ${node}`)
            const neighbors = graph.getNeighbors(node);
            if (neighbors.length === 0) return 1;
            const allNeighborBags = neighbors.map((neighbor) => {
                // console.log(`${node} neighbor ${neighbor} has ${graph.getEdgeValue(node, neighbor)}`);
                return (graph.getEdgeValue(node, neighbor) || 1) * traverse(neighbor);
            });

            // console.log(`${node} all bags ${allNeighborBags}`)
            const neighborSum = 1 + sum(allNeighborBags);

            // console.log(`${node} neighbor sum for ${neighbors.length} is ${neighborSum}`);
            return neighborSum;
        };

        const start = 'shiny gold';
        return (traverse(start) - 1).toString();
    }
}

interface Bag {
    color: string;
    children: { count: number; color: string }[];
}

const parseLine = (line: string): Bag => {
    const matches = line.match(/^(\w+\s\w+)\sbags\scontain\s(.*)\.$/);
    if (!matches) throw new Error('fucked up');

    const [color, rawChildren] = matches.slice(1);

    // console.log(`RAW LINE IS ${line}`);
    // console.log(`RAW CHILDREN IS ${rawChildren}`);
    const children = [] as any[];
    if (rawChildren !== 'no other bags') {
        rawChildren.split(',').forEach((child) => {
            const matches = child
                .trim()
                .match(/(\d+)\s(\w+\s\w+)/)
                ?.slice(1);
            if (!matches) throw new Error('fucked up the children');

            const [count, color] = matches;

            children.push({ count, color });
        });
    }

    return { color, children };
};
