import { main } from '../src/aoc';

describe('aoc list', () => {
    const originalArgv = process.argv;
    let log: jest.SpyInstance;

    beforeEach(() => {
        log = jest.spyOn(console, 'log').mockImplementation(() => undefined);
        jest.spyOn(console, 'group').mockImplementation(() => undefined);
        jest.spyOn(console, 'groupEnd').mockImplementation(() => undefined);
    });

    afterEach(() => {
        process.argv = originalArgv;
        jest.restoreAllMocks();
    });

    it('lists solutions and skips the template', async () => {
        process.argv = ['node', 'aoc', 'list'];

        await main();

        const output = log.mock.calls.join('\n');
        expect(output).toContain('2015.1: ');
        expect(output).not.toContain('template');
    });
});
