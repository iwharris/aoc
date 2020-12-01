import commander from 'commander';
import { getSolutions, getInfo, solveChallenge } from './challenge';
import { version, description } from '../package.json';
import { readInputFromFile, readInputFromStdin } from './util/io';
import { getName, normalizeId } from './util/helper';
import { ChallengeInput } from './types';

const handleList = async () => {
    const solutions = await getSolutions();
    const sortedSolutions = Object.entries(solutions).sort(([a], [b]) => Number(a) - Number(b));

    let currentYear = '';
    sortedSolutions.forEach(([id, solution]) => {
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

        console.log(`${part1Str}${part2Str} ${id}: ${getName(solution)}`);
    });
};

const handleInfo = async (challengeId: string): Promise<void> => {
    const info = await getInfo(challengeId);

    console.log(info);
};

const handleSolve = async (challengeId: string, command: commander.Command): Promise<void> => {
    const id = normalizeId(challengeId);

    const input: ChallengeInput = command.inputFile
        ? await readInputFromFile(command.inputFile)
        : readInputFromStdin();

    const results = await solveChallenge(id, input);

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

const main = async () => {
    await parseArgs(process.argv);
};

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
