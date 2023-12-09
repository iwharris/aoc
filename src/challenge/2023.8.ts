import { BaseSolution } from '../solution';
import { Input } from '../types';
import { lcm } from '../util/math';

export class Solution extends BaseSolution {
    description = `

    `;

    public solvePart1(lines: Input): string {
        const steps = lines[0].split('');
        const nodeArray = lines.slice(1).map(parseNode);

        const nodes: Record<string, Node> = nodeArray.reduce((acc, cur) => {
            acc[cur.id] = cur;
            return acc;
        }, {});

        let stepCount = 0;
        let currentNode = nodes['AAA'];

        // console.log('currentNode', currentNode.id);

        while (currentNode.id !== 'ZZZ') {
            // traverse
            const nextStep = steps[stepCount % steps.length];
            // console.log(`nextStep is ${nextStep}`);
            stepCount += 1;
            currentNode = nodes[currentNode[nextStep]];
        }
        return stepCount.toString();
    }

    public solvePart2(lines: Input): string {
        const steps = lines[0].split('');
        const nodeArray = lines.slice(1).map(parseNode);

        const nodes: Record<string, Node> = nodeArray.reduce((acc, cur) => {
            acc[cur.id] = cur;
            return acc;
        }, {});

        // The paths through the maze are cyclic - we can find each ghost's step count to the goal and then
        // find the least common multiple of all
        const allSteps = Object.values(nodes)
            .filter((n) => n.id.endsWith('A'))
            .map((currentNode) => {
                let stepCount = 0;
                while (!currentNode.id.endsWith('Z')) {
                    // traverse
                    const nextStep = steps[stepCount % steps.length];
                    // console.log(`nextStep is ${nextStep}`);
                    stepCount += 1;
                    currentNode = nodes[currentNode[nextStep]];
                }
                return stepCount;
            });

        return lcm(...allSteps).toString();

        // return stepCount.toString();
    }
}

type Node = {
    id: string;
    L: string;
    R: string;
};

const parseNode = (line: string): Node => {
    const [, id, L, R] = line.match(/^(\w+)\s=\s\((\w+),\s(\w+)\)/) ?? [];
    return { id, L, R };
};
