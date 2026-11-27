import { getName } from '../../src/util/helper';

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
