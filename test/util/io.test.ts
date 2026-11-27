import fs from 'fs';
import path from 'path';
import {
    fileExists,
    getIdFromPath,
    importSolutionDynamically,
    readInputFromFile,
    readInputFromStdin,
} from '../../src/util/io';

const example = path.join(__dirname, '../../input/2015.1.example');
const missing = path.join(__dirname, 'no-such-file');
const src = path.join(__dirname, '../../src');

describe('io', () => {
    let warn: jest.SpyInstance;

    beforeEach(() => {
        warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    });

    afterEach(() => jest.restoreAllMocks());

    it('should check whether a file exists', () => {
        expect(fileExists(example)).toBe(true);
        expect(fileExists(missing)).toBe(false);
    });

    it('should read a file', async () => {
        expect(await readInputFromFile(example)).toBe(fs.readFileSync(example, 'utf8'));
    });

    it('should read from stdin', () => {
        const read = jest.spyOn(fs, 'readFileSync').mockReturnValue('from stdin');

        expect(readInputFromStdin()).toBe('from stdin');
        expect(read).toHaveBeenCalledWith(0, 'utf8');
    });

    it('should return an empty string when stdin cannot be read', () => {
        jest.spyOn(fs, 'readFileSync').mockImplementation(() => {
            throw new Error('no stdin');
        });

        expect(readInputFromStdin()).toBe('');
        expect(warn).toHaveBeenCalledWith(expect.stringContaining('no stdin'));
    });

    it('should fall back to stdin when a file cannot be read', async () => {
        jest.spyOn(fs, 'readFileSync').mockReturnValue('from stdin');

        expect(await readInputFromFile(missing)).toBe('from stdin');
        expect(warn).toHaveBeenCalledWith(expect.stringContaining(missing));
    });

    it('should import a solution', async () => {
        const solution = await importSolutionDynamically(`${src}/challenge/2015.1`);

        expect(solution.solvePart1?.(['((('])).toBe('3');
    });

    it('should explain when a module has no solution', async () => {
        const modulePath = `${src}/util/math`;

        await expect(importSolutionDynamically(modulePath)).rejects.toThrow(
            `Module at path "${modulePath}" has no solution`
        );
    });

    it('should get the ID from a module path', () => {
        expect(getIdFromPath('/a/b.c/challenge/2022.14.ts')).toBe('2022.14');
    });
});
