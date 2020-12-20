import { isObject } from 'util';
import { BaseSolution, Input } from '../solution';
import { product, sum } from '../util/fp';
import { parseInput } from '../util/parser';

export class Solution extends BaseSolution {
    public description = `
    --- Day 16: Ticket Translation ---

    As you're walking to yet another connecting flight, you realize that one of the legs of your re-routed trip coming up is on a high-speed train. However, the train ticket you were given is in a language you don't understand. You should probably figure out what it says before you get to the train station after the next flight.

    Unfortunately, you can't actually read the words on the ticket. You can, however, read the numbers, and so you figure out the fields these tickets must have and the valid ranges for values in those fields.

    You collect the rules for ticket fields, the numbers on your ticket, and the numbers on other nearby tickets for the same train service (via the airport security cameras) together into a single document you can reference (your puzzle input).

    The rules for ticket fields specify a list of fields that exist somewhere on the ticket and the valid ranges of values for each field. For example, a rule like class: 1-3 or 5-7 means that one of the fields in every ticket is named class and can be any value in the ranges 1-3 or 5-7 (inclusive, such that 3 and 5 are both valid in this field, but 4 is not).

    Each ticket is represented by a single line of comma-separated values. The values are the numbers on the ticket in the order they appear; every ticket has the same format. For example, consider this ticket:

    .--------------------------------------------------------.
    | ????: 101    ?????: 102   ??????????: 103     ???: 104 |
    |                                                        |
    | ??: 301  ??: 302             ???????: 303      ??????? |
    | ??: 401  ??: 402           ???? ????: 403    ????????? |
    '--------------------------------------------------------'
    Here, ? represents text in a language you don't understand. This ticket might be represented as 101,102,103,104,301,302,303,401,402,403; of course, the actual train tickets you're looking at are much more complicated. In any case, you've extracted just the numbers in such a way that the first number is always the same specific field, the second number is always a different specific field, and so on - you just don't know what each position actually means!

    Start by determining which tickets are completely invalid; these are tickets that contain values which aren't valid for any field. Ignore your ticket for now.

    For example, suppose you have the following notes:

    class: 1-3 or 5-7
    row: 6-11 or 33-44
    seat: 13-40 or 45-50

    your ticket:
    7,1,14

    nearby tickets:
    7,3,47
    40,4,50
    55,2,20
    38,6,12
    It doesn't matter which position corresponds to which field; you can identify invalid nearby tickets by considering only whether tickets contain values that are not valid for any field. In this example, the values on the first nearby ticket are all valid for at least one field. This is not true of the other three nearby tickets: the values 4, 55, and 12 are are not valid for any field. Adding together all of the invalid values produces your ticket scanning error rate: 4 + 55 + 12 = 71.

    Consider the validity of the nearby tickets you scanned. What is your ticket scanning error rate?

    --- Part Two ---

    Now that you've identified which tickets contain invalid values, discard those tickets entirely. Use the remaining valid tickets to determine which field is which.
    
    Using the valid ranges for each field, determine what order the fields appear on the tickets. The order is consistent between all tickets: if seat is the third field, it is the third field on every ticket, including your ticket.
    
    For example, suppose you have the following notes:
    
    class: 0-1 or 4-19
    row: 0-5 or 8-19
    seat: 0-13 or 16-19
    
    your ticket:
    11,12,13
    
    nearby tickets:
    3,9,18
    15,1,5
    5,14,9
    Based on the nearby tickets in the above example, the first position must be row, the second position must be class, and the third position must be seat; you can conclude that in your ticket, class is 12, row is 11, and seat is 13.
    
    Once you work out which field is which, look for the six fields on your ticket that start with the word departure. What do you get if you multiply those six values together?
    `;

    parseInput(raw: string) {
        return parseInput(raw, { preserveEmptyLines: true });
    }

    solvePart1(lines: Input): string {
        const notes = parseNotes(lines);

        const invalidNumbers = notes.otherTickets
            .map((ticket) => {
                return ticket.filter((num) => {
                    return Object.values(notes.fields).every((ranges) =>
                        ranges.every((range) => !numberIsInRange(num, range))
                    );
                });
            })
            .flat();

        // console.log(invalidNumbers)

        return sum(invalidNumbers).toString();
    }

    solvePart2(lines: Input): string {
        const notes = parseNotes(lines);

        // Filter out invalid tickets
        notes.otherTickets = notes.otherTickets.filter((ticket) =>
            isTicketValid(ticket, notes.fields)
        );

        const allTickets = [notes.myTicket, ...notes.otherTickets];

        // Mapping of field index to field name
        const matches: Map<number, string> = new Map();

        // Mapping of field index to a set of possible Fields
        const possible: Map<number, Set<string>> = new Map();

        // For each field:
        for (let fieldIndex = 0; fieldIndex < notes.myTicket.length; fieldIndex++) {
            // Create a mapping of field index to a Set of possible Field matches and pre-populate with all fields
            const possibleForThisField: Set<string> = new Set(Object.keys(notes.fields));
            // Populate the Set by iterating through the same field in every ticket
            for (const ticket of allTickets) {
                const ticketFieldValue = ticket[fieldIndex];
                const eliminatedFields = Object.keys(notes.fields).filter((name) => {
                    const ranges = notes.fields[name];
                    return ranges.every((range) => !numberIsInRange(ticketFieldValue, range)); // fieldValue falls within one range
                });

                eliminatedFields.forEach((fieldName) => possibleForThisField.delete(fieldName));
            }
            possible.set(fieldIndex, possibleForThisField);
        }

        // console.log(possible);

        // while not solved:
        while (matches.size !== Object.keys(notes.fields).length) {
            // check if a field index has only one possible field match
            const nextMatch = Array.from(possible.entries()).find((entry) => entry[1].size === 1);

            if (!nextMatch) throw new Error(`couldn't find any field with 1 possibility`);

            const [fieldIndex, set] = nextMatch;
            const [fieldName] = Array.from(set.values());

            // If so, remove that field name from every Set and add it to the solution mapping
            matches.set(fieldIndex, fieldName);

            possible.forEach((set) => set.delete(fieldName));
        }
        // continue until all fields are in the solution mapping

        const departureValues = Array.from(matches.entries())
            .filter(([fieldIndex, fieldName]) => fieldName.startsWith('departure'))
            .map(([fieldIndex]) => notes.myTicket[fieldIndex]);

        // console.log(`got ${departureValues.length} vals`);

        return (product(departureValues) as number).toString();
    }
}

const numberIsInRange = (num: number, [min, max]: Range): boolean => {
    const result = num >= min && num <= max;
    // console.log(`${num} is within ${min}-${max}: ${result}`);
    return result;
};

const isTicketValid = (ticket: Ticket, fields: Record<string, Range[]>): boolean => {
    return (
        ticket.filter((num) => {
            return Object.values(fields).every((ranges) =>
                ranges.every((range) => !numberIsInRange(num, range))
            );
        }).length === 0
    );
};

const parseNotes = (input: Input): Notes => {
    const otherTickets: Ticket[] = [];
    const fields: Record<string, Range[]> = {};

    let i = 0;
    while (i < input.length) {
        const line = input[i];
        // console.log(`line: "${line}"`)
        if (!line) break;

        const matches = line.match(/([\w\s]+)\:\s(\d+)-(\d+)\sor\s(\d+)-(\d+)/);
        if (!matches) throw new Error(`can't parse line: ${line}`);

        const [field, min1, max1, min2, max2] = matches.slice(1);
        fields[field] = [
            [parseInt(min1), parseInt(max1)],
            [parseInt(min2), parseInt(max2)],
        ];

        i += 1;
    }

    i += 2; // get to my ticket

    const myTicket = input[i].split(',').map((n) => parseInt(n));

    i += 3; // get to nearby tickets

    while (i < input.length) {
        otherTickets.push(input[i].split(',').map((n) => parseInt(n)));
        i += 1;
        if (!input[i]) break;
    }

    return {
        myTicket,
        otherTickets,
        fields,
    };
};

type Range = [number, number];
type Ticket = number[];

interface Notes {
    fields: Record<string, Range[]>;
    myTicket: Ticket;
    otherTickets: Ticket[];
}
