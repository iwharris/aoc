import commander from 'commander';
import { glob } from 'glob';
import util from 'util';
import { version, description } from '../package.json';
import { DEFAULT_ENCODING, getIdFromPath, readInputFromFile, readInputFromStdin } from './util/io';
import { parseId, normalizeId } from './util/helper';
import { Solution, SolutionMap } from './types';
import { importSolutionDynamically } from './util/io';
import { NotImplementedError } from './util/error';

/* eslint-disable no-console */

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
        solutionMap[getIdFromPath(modulePath)] = solution;
    }

    return solutionMap;
};

const handleList = async (command: commander.Command) => {
    const year: string = command.year;

    const solutions = await getSolutions();
    const sortedSolutions = Object.entries(solutions)
        .filter(([id]) => (year ? year === id.split('.')[0] : true))
        .sort(([id1], [id2]) => Number(id1) - Number(id2));

    let currentYear: number = -1;
    sortedSolutions.forEach(([id, solution]) => {
        const y = parseInt(id.split('.')[0]);
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
    const { encoding } = command;

    const id = normalizeId(challengeId);

    const rawInput = command.inputFile
        ? await readInputFromFile(command.inputFile, encoding)
        : readInputFromStdin(encoding);

    const solution = await getSolution(id);

    const parsedInput = solution.parseInput(rawInput);

    const callbacks = [
        () => (!!solution.solvePart1 ? solution.solvePart1(parsedInput) : null),
        () => (!!solution.solvePart2 ? solution.solvePart2(parsedInput) : null),
    ];

    const results = callbacks.map((callback) => {
        try {
            return callback();
        } catch (err) {
            if (err instanceof NotImplementedError || /Method not implemented/.test(err.message))
                return null;
            else throw err;
        }
    });

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
        .option(
            '-e, --encoding <encoding>',
            'Optional encoding for the input data',
            DEFAULT_ENCODING
        )
        .action(handleSolve);

    return commander.parseAsync(args);
};

export const main = async () => {
    await parseArgs(process.argv);
};
