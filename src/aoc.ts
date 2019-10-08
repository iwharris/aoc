import commander from 'commander';
import { challenges, Solutions } from './challenge';

import { version, description } from '../package.json';
import { readInput } from './util/io';

const DEFAULT_YEAR = '2018';

function parseChallengeId(id: string): [string, string] {
    const [year, day] = id.split('.', 2).map(val => Number(val).toString());

    return [year, day];
}

function normalizeChallengeId(id: string): string {
    return parseChallengeId(id).join('.');
}

function handleList(command: commander.Command) {
    const { year } = command;
    
    const sortedSolutions = new Solutions(challenges).list();

    let currentYear = '';
    sortedSolutions.forEach(([id, solution]) => {
        const [y,d] = id.split('.');
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
}

function handleInfo(challengeId: string) {
    const id = normalizeChallengeId(challengeId);
    const solutions = new Solutions(challenges);
    const info = solutions.info(id);

    console.log(info);
}

function handleSolve(challengeId: string) {
    const id = normalizeChallengeId(challengeId);
    const input = readInput();
    const solutions = new Solutions(challenges);
    const results = solutions.solveChallenge(id, input);

    results.forEach((result: string | null, idx: number) => {
        console.log(`Part ${idx+1}: ${result || ''}`);
    })
}

function parseArgs(args: string[]): commander.Command {
    // Base script
    commander
        .version(version)
        .description(description);

    const listCommand = commander
        .command('list')
        .description('Lists the implemented solutions')
        .option('-y, --year <year>', 'Restricts challenges by year', DEFAULT_YEAR)
        .action(handleList);

    const infoCommand = commander
        .command('info <challengeId>')
        .description('Prints info for a given challenge. Challenges are identified by YEAR.DAY, eg. 2019.2')
        .action(handleInfo);

    const solveCommand = commander
        .command('solve <challengeId>')
        .description('Solves a challenge using input from stdin. Prints solutions to stdout.')
        .action(handleSolve);

    return commander.parse(args);
}

function main() {
    parseArgs(process.argv);
}

main();