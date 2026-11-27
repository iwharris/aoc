import { getName, normalizeId, parseId } from '../../src/util/helper';

const withDescription = (description: string) => ({ description } as any);

describe('getName', () => {
    it.each(['Not Quite Lisp', 'Cathode-Ray Tube', 'Trebuchet?!'])(
        'should read the title "%s"',
        (title) => {
            expect(getName(withDescription(`\n    --- Day 1: ${title} ---\n    Text`))).toBe(title);
        }
    );

    it.each(['', '\n\n    '])('should use a placeholder for a blank description %j', (blank) => {
        expect(getName(withDescription(blank))).toBe('(untitled)');
    });

    it('should reject a description without a title line', () => {
        expect(() => getName(withDescription('Some text\n'))).toThrow('malformed');
    });
});

describe('parseId', () => {
    it('should parse a year and day', () => {
        expect(parseId('2020.14')).toEqual([2020, 14]);
        expect(normalizeId('2020.01')).toBe('2020.1');
    });

    it.each(['template', '2020', '2020.0', '2020.1abc', '2020.-1', '2020.1.5', '20.1'])(
        'should reject "%s"',
        (id) => {
            expect(() => parseId(id)).toThrow('Cannot parse ID');
        }
    );
});
