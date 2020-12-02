import commander from 'commander';
import { glob } from 'glob';
import util from 'util';
import { version, description } from '../package.json';
import { readInputFromFile, readInputFromStdin } from './util/io';
import { parseId, normalizeId } from './util/helper';
import { Input, Solution, SolutionMap } from './types';
import { importSolutionDynamically } from './util/io';

const globAsync = util.promisify(glob);

const getSolution = async (id: string): Promise<Solution> => {
    const [year, day] = parseId(id);
    const fullPath = `${__dirname}/challenge/${year}.${day}`;
    return importSolutionDynamically(fullPath);
};

const getSolutions = async (): Promise<SolutionMap> => {
    const solutionMap = {};

    const modules = await globAsync(`${__dirname}/challenge/*.[tj]s`);

    for (const modulePath of modules) {
        const solution: Solution = await importSolutionDynamically(modulePath);
        solutionMap[solution.id] = solution;
    }

    return solutionMap;
};

const handleList = async () => {
    const solutions = await getSolutions();
    const sortedSolutions = Object.entries(solutions).sort(([a], [b]) => Number(a) - Number(b));

    let currentYear = '';
    sortedSolutions.forEach(([id, solution]) => {
        console.log(solution);
        const [y] = id.split('.');
        if (y !== currentYear) {
            if (currentYear) {
                console.log('\n');
                console.groupEnd();
            }
            currentYear = y;
            console.group(currentYear);
        }

        const part1Str = solution.solvePart1 ? '[P1]' : '    ';
        const part2Str = solution.solvePart2 ? '[P2]' : '    ';

        console.log(`${part1Str}${part2Str} ${id}: ${solution.name}`);
    });
};

const handleInfo = async (challengeId: string): Promise<void> => {
    const solution = await getSolution(challengeId);

    console.log(solution.description);
};

const handleSolve = async (challengeId: string, command: commander.Command): Promise<void> => {
    const id = normalizeId(challengeId);

    const input: Input = command.inputFile
        ? await readInputFromFile(command.inputFile)
        : readInputFromStdin();

    const solution = await getSolution(id);

    const results = [
        !!solution.solvePart1 ? solution.solvePart1(input) : null,
        !!solution.solvePart2 ? solution.solvePart2(input) : null,
    ];

    results.forEach((result: string | null, idx: number) => {
        console.log(`Part ${idx + 1}: ${result || ''}`);
    });
};

const parseArgs = (args: string[]) => {
    // Base script
    commander.version(version).description(description);

    commander
        .command('list')
        .description('Lists the implemented solutions')
        .option('-y, --year <year>', 'Restricts challenges by year, eg. -y 2018')
        .action(handleList);

    commander
        .command('info <challengeId>')
        .description(
            'Prints info for a given challenge. Challenges are identified by YEAR.DAY, eg. 2019.2'
        )
        .action(handleInfo);

    commander
        .command('solve <challengeId>')
        .description('Solves a challenge using input from stdin. Prints solutions to stdout.')
        .option('-i, --input-file <inputFile>', 'Input file (alternative to stdin)')
        .action(handleSolve);

    return commander.parseAsync(args);
};

export const main = async () => {
    await parseArgs(process.argv);
};
