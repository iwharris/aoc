const description = `
--- Day 7: The Sum of Its Parts ---
You find yourself standing on a snow-covered coastline; apparently, you landed a little off course. The region is too hilly to see the North Pole from here, but you do spot some Elves that seem to be trying to unpack something that washed ashore. It's quite cold out, so you decide to risk creating a paradox by asking them for directions.

"Oh, are you the search party?" Somehow, you can understand whatever Elves from the year 1018 speak; you assume it's Ancient Nordic Elvish. Could the device on your wrist also be a translator? "Those clothes don't look very warm; take this." They hand you a heavy coat.

"We do need to find our way back to the North Pole, but we have higher priorities at the moment. You see, believe it or not, this box contains something that will solve all of Santa's transportation problems - at least, that's what it looks like from the pictures in the instructions." It doesn't seem like they can read whatever language it's in, but you can: "Sleigh kit. Some assembly required."

"'Sleigh'? What a wonderful name! You must help us assemble this 'sleigh' at once!" They start excitedly pulling more parts out of the box.

The instructions specify a series of steps and requirements about which steps must be finished before others can begin (your puzzle input). Each step is designated by a single letter. For example, suppose you have the following instructions:

Step C must be finished before step A can begin.
Step C must be finished before step F can begin.
Step A must be finished before step B can begin.
Step A must be finished before step D can begin.
Step B must be finished before step E can begin.
Step D must be finished before step E can begin.
Step F must be finished before step E can begin.
Visually, these requirements look like this:

  -->A--->B--
 /    \      \
C      -->D----->E
 \           /
  ---->F-----
Your first goal is to determine the order in which the steps should be completed. If more than one step is ready, choose the step which is first alphabetically. In this example, the steps would be completed as follows:

Only C is available, and so it is done first.
Next, both A and F are available. A is first alphabetically, so it is done next.
Then, even though F was available earlier, steps B and D are now also available, and B is the first alphabetically of the three.
After that, only D and F are available. E is not available because only some of its prerequisites are complete. Therefore, D is completed next.
F is the only choice, so it is done next.
Finally, E is completed.
So, in this example, the correct order is CABDFE.

In what order should the steps in your instructions be completed?
`;

type Node = string;
type DependencyPair = [Node, Node];

class DependencyGraph {
    // Mapping from a node to an array of that node's dependencies
    public nodes: Map<Node, Node[]>;

    constructor(pairs: DependencyPair[]) {
        this.nodes = new Map<Node, Node[]>();

        pairs.forEach(([dependency, node]) => {
            const deps = this.nodes.get(node);
            if (!this.nodes.has(dependency)) this.nodes.set(dependency, []);
            if (!deps) this.nodes.set(node, [dependency]);
            else {
                deps.push(dependency);
                deps.sort();
            }
        });
    }

    public isSolved(): boolean {
        return !this.nodes.size;
    }

    public solve(): string {
        const solveNodes: string[] = [];

        while (!this.isSolved()) {
            const nextDep = this.popDependency();
            // console.log(`Popped ${nextDep}`);
            // console.log(this.nodes);
            solveNodes.push(nextDep);
        }

        return solveNodes.join('');
    }

    private popDependency(): Node {
        const nextDep = this.getNextAvailableDependency();

        this.nodes.delete(nextDep);

        this.nodes.forEach((deps) => {
            if (deps.includes(nextDep)) deps.splice(deps.findIndex((d) => d === nextDep), 1);
        });

        return nextDep;
    }

    private getNextAvailableDependency(): Node {
        const availableNodes = Array.from(this.nodes.entries())
            .filter(([_ignore, deps]) => !deps.length) // drop nodes with one or more deps
            .sort(([a], [b]) => a.localeCompare(b));

        return availableNodes[0][0];
    }
}

function solvePart1(lines: string[]): string {
    const dependencies: DependencyPair[] = lines
        .map((line) => /^Step (\w) must be finished before step (\w) can begin.$/.exec(line))
        .map((matches) => {
            if (!matches) throw new Error('Invalid input');
            const [_ignore, first, second] = matches;
            return [first, second];
        });

    const graph = new DependencyGraph(dependencies);

    return graph.solve();
}

export default {
    description,
    solvePart1,
};
