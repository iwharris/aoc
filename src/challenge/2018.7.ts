import { BaseSolution, Input } from '../solution';

export class Solution extends BaseSolution {
    description = `
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
    
    --- Part Two ---
    As you're about to begin construction, four of the Elves offer to help. "The sun will set soon; it'll go faster if we work together." Now, you need to account for multiple people working on steps simultaneously. If multiple steps are available, workers should still begin them in alphabetical order.
    
    Each step takes 60 seconds plus an amount corresponding to its letter: A=1, B=2, C=3, and so on. So, step A takes 60+1=61 seconds, while step Z takes 60+26=86 seconds. No time is required between steps.
    
    To simplify things for the example, however, suppose you only have help from one Elf (a total of two workers) and that each step takes 60 fewer seconds (so that step A takes 1 second and step Z takes 26 seconds). Then, using the same instructions as above, this is how each second would be spent:
    
    Second   Worker 1   Worker 2   Done
       0        C          .
       1        C          .
       2        C          .
       3        A          F       C
       4        B          F       CA
       5        B          F       CA
       6        D          F       CAB
       7        D          F       CAB
       8        D          F       CAB
       9        D          .       CABF
      10        E          .       CABFD
      11        E          .       CABFD
      12        E          .       CABFD
      13        E          .       CABFD
      14        E          .       CABFD
      15        .          .       CABFDE
    Each row represents one second of time. The Second column identifies how many seconds have passed as of the beginning of that second. Each worker column shows the step that worker is currently doing (or . if they are idle). The Done column shows completed steps.
    
    Note that the order of the steps has changed; this is because steps now take time to finish and multiple workers can begin multiple steps simultaneously.
    
    In this example, it would take 15 seconds for two workers to complete these steps.
    
    With 5 workers and the 60+ second step durations described above, how long will it take to complete all of the steps?
    `;

    solvePart1(lines: Input): string {
        const pairs = parseInput(lines);
        const graph = new DependencyGraph(pairs);

        return graph.solvePart1();
    }

    solvePart2(lines: Input, workerCount = 5, baseTaskCost = 60): string {
        const pairs = parseInput(lines);
        const scheduler = new TaskScheduler(pairs, workerCount, baseTaskCost);

        return scheduler.solvePart2();
    }
}

type Task = string;
type DependencyPair = [Task, Task];

class DependencyGraph {
    // Mapping from a node to an array of that node's dependencies
    public nodes: Map<Task, Task[]>;

    constructor(pairs: DependencyPair[]) {
        this.nodes = new Map<Task, Task[]>();

        pairs.forEach(([dependency, task]) => {
            const deps = this.nodes.get(task);
            if (!this.nodes.has(dependency)) this.nodes.set(dependency, []);
            if (!deps) this.nodes.set(task, [dependency]);
            else {
                deps.push(dependency);
                deps.sort();
            }
        });
    }

    public isSolved(): boolean {
        return !this.nodes.size;
    }

    public solvePart1(): string {
        const solveNodes: string[] = [];

        while (!this.isSolved()) {
            const nextDep = this.popTask();
            // console.log(`Popped ${nextDep}`);
            // console.log(this.nodes);
            solveNodes.push(nextDep);
        }

        return solveNodes.join('');
    }

    public isTaskCompletable(task: Task): boolean {
        const deps = this.nodes.get(task);
        if (!deps) throw new Error(`Task ${task} does not exist`);
        return deps.length === 0;
    }

    public getAvailableTasks(): Task[] {
        const tasks: Task[] = [];
        this.nodes.forEach((deps, task) => {
            if (!deps.length) tasks.push(task);
        });

        tasks.sort((a, b) => a.localeCompare(b));

        return tasks;
    }

    public peekTask(): Task {
        return this.getNextAvailableTask();
    }

    private popTask(): Task {
        const task = this.getNextAvailableTask();
        this.completeTask(task);
        return task;
    }

    public completeTask(task: Task): void {
        if (!this.isTaskCompletable(task)) throw new Error(`Task ${task} is not completable`);

        this.nodes.delete(task);

        this.nodes.forEach((deps) => {
            if (deps.includes(task))
                deps.splice(
                    deps.findIndex((d) => d === task),
                    1
                );
        });
    }

    private getNextAvailableTask(): Task {
        return this.getAvailableTasks()[0];
    }
}

interface Worker {
    currentTask?: Task;
    secondsRemaining: number;
}

class TaskScheduler {
    private graph: DependencyGraph;
    private workers: Worker[] = [];
    private t = 0;
    private inProgress: Set<Task> = new Set<Task>();
    private baseCost: number;

    constructor(pairs: DependencyPair[], workerCount: number, baseTaskCost: number) {
        this.graph = new DependencyGraph(pairs);
        this.baseCost = baseTaskCost;

        for (let i = 0; i < workerCount; i++) {
            this.workers.push({
                currentTask: undefined,
                secondsRemaining: 0,
            });
        }
    }

    public solvePart2(): string {
        while (!this.graph.isSolved()) {
            this.tick();
        }

        return (this.t - 1).toString();
    }

    private tick(): void {
        this.workers.forEach((worker, index) => {
            if (worker.currentTask) {
                if (worker.secondsRemaining > 0) {
                    worker.secondsRemaining -= 1; // tick
                }

                if (worker.secondsRemaining === 0) {
                    this.completeTask(index);
                }
            }

            if (!worker.currentTask) {
                const task = this.findAvailableTask();

                if (task) {
                    this.assignTask(index, task);
                } else {
                    // console.log(`w${index} can't do any tasks yet`);
                }
            }
        });

        // console.log(this.getCurrentState());

        this.t += 1;
    }

    public getCurrentState(): string {
        const time = `t=${this.t}`.padStart(6);
        const workers = this.workers.map((w, i) => `w${i}=${w.currentTask || '.'}`).join(' ');

        return `${time} ${workers}`;
    }

    private computeTimeForTask(task: Task) {
        return task.charCodeAt(0) - 64 + this.baseCost;
    }

    private findAvailableTask(): Task | undefined {
        const availableTasks = this.graph
            .getAvailableTasks()
            .filter((t) => !this.inProgress.has(t)); // Get tasks that are not reserved

        return availableTasks.length ? availableTasks[0] : undefined;
    }

    private assignTask(workerIndex: number, task: Task): void {
        if (this.inProgress.has(task)) throw new Error(`Task ${task} is already in progress`);
        this.inProgress.add(task);
        this.workers[workerIndex].currentTask = task;
        this.workers[workerIndex].secondsRemaining = this.computeTimeForTask(task);
        // console.log(`w${workerIndex} started task ${task}`);
    }

    private completeTask(workerIndex: number): void {
        const worker = this.workers[workerIndex];
        const task = worker.currentTask;
        if (worker.secondsRemaining !== 0) throw new Error(`w${workerIndex} is not done task`);
        if (!task) throw new Error(`w${workerIndex} does not have a task`);

        this.graph.completeTask(task);
        worker.currentTask = undefined;
        // console.log(`w${workerIndex} completed task ${task}`);
    }
}

function parseInput(lines: string[]): DependencyPair[] {
    return lines
        .map((line) => /^Step (\w) must be finished before step (\w) can begin.$/.exec(line))
        .map((matches) => {
            if (!matches) throw new Error('Invalid input');
            return [matches[1], matches[2]];
        });
}
