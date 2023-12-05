import { BaseSolution } from '../solution';
import { Input } from '../types';

export class Solution extends BaseSolution {
    description = ``;

    preserveEmptyLines = true;

    public solvePart1(lines: Input): string {
        const [seeds, mappingList] = parseInput(lines);
        // console.log('seeds', seeds);
        // console.log('mappings', JSON.stringify(mappingList, null, 2));

        // Create a lookup table
        const mappings: Record<string, Mapping> = {};
        mappingList.forEach((m) => (mappings[m.from] = m));

        const followMapping = (category: string, id: number): [string, number] => {
            const mapping = mappings[category];
            if (!mapping) throw new Error(`could not find mapping for ${category}`);
            // find the range object that matches this id
            const rangeObj = mapping.ranges.find(
                (range) => id >= range.sourceStart && id < range.sourceStart + range.rangeLength
            );
            let destinationId = id;
            if (rangeObj) {
                destinationId = rangeObj.destinationStart + id - rangeObj.sourceStart;
                // console.log(`translated ${id} to ${destinationId}`);
            } else {
                // console.log(`kept ${id}`);
            }

            return [mapping.to, destinationId];
        };

        const followAllMappings = (category: string, id: number): [string, number] => {
            if (category !== 'location') {
                const [newCategory, newId] = followMapping(category, id);
                return followAllMappings(newCategory, newId);
            } else {
                return [category, id];
            }
        };

        // seeds.map((id) => followMapping('seed', id)).forEach((result) => console.log(result));

        const results = seeds.map((id) => followAllMappings('seed', id));

        return Math.min(...results.map((r) => r[1])).toString();
    }

    public solvePart2(lines: Input): string {
        const [seeds, mappingList] = parseInput(lines);

        const seedRanges = seeds.flatMap((_, i, a) => (i % 2 ? [] : [a.slice(i, i + 2)]));

        // Create a lookup table
        const mappings: Record<string, Mapping> = {};
        mappingList.forEach((m) => (mappings[m.from] = m));

        const followMapping = (category: string, id: number): [string, number] => {
            const mapping = mappings[category];
            if (!mapping) throw new Error(`could not find mapping for ${category}`);
            // find the range object that matches this id
            const rangeObj = mapping.ranges.find(
                (range) => id >= range.sourceStart && id < range.sourceStart + range.rangeLength
            );
            let destinationId = id;
            if (rangeObj) {
                destinationId = rangeObj.destinationStart + id - rangeObj.sourceStart;
                // console.log(`translated ${id} to ${destinationId}`);
            } else {
                // console.log(`kept ${id}`);
            }

            return [mapping.to, destinationId];
        };

        const followAllMappings = (category: string, id: number): [string, number] => {
            while (category !== 'location') {
                const [newCategory, newId] = followMapping(category, id);
                category = newCategory;
                id = newId;
            }
            return [category, id];
        };

        let lowestLocationNumber = Infinity;

        // bruteforce it
        for (const [rangeStart, rangeLength] of seedRanges) {
            for (let i = 0; i < rangeLength; i++) {
                if (i % 10000000 === 0) {
                    // eslint-disable-next-line no-console
                    // console.log(
                    //     `[${rangeStart}, ${rangeLength}]  ${(i / rangeLength) * 100}% complete...`
                    // );
                }
                lowestLocationNumber = Math.min(
                    lowestLocationNumber,
                    followAllMappings('seed', rangeStart + i)[1]
                );
            }
        }

        return lowestLocationNumber.toString();
    }
}

const parseInput = (lines: Input): [number[], Mapping[]] => {
    const seeds = lines[0].match(/\d+/g)?.map((n) => parseInt(n)) ?? [];

    // console.log(seeds);
    const mappings = lines
        .slice(2)
        .join('\n')
        .split('\n\n')
        .map((block) => block.split('\n'))
        .map((blockLines) => {
            const [, from, to] = /^(\w+)\-to\-(\w+) map\:$/.exec(blockLines[0]) ?? [];
            // console.log('line', blockLines[0]);
            // console.log(from, to);
            const ranges = blockLines.slice(1).map((line) => {
                const [, destinationStart, sourceStart, rangeLength] =
                    line.match(/(\d+)\s(\d+)\s(\d+)$/)?.map((n) => parseInt(n)) ?? [];
                return { destinationStart, sourceStart, rangeLength };
            });

            return { from, to, ranges } as Mapping;
        });

    return [seeds, mappings];
};

type Mapping = {
    from: string;
    to: string;

    ranges: {
        destinationStart: number;
        sourceStart: number;
        rangeLength: number;
    }[];
};
