/**
 * Represents a range of numbers from start to end, inclusive.
 */
class AocRange {
    public readonly start: number;
    public readonly end: number;

    get length() {
        return this.end - this.start;
    }

    constructor(start: number, end: number) {
        if (start > end) {
            // Ensure that 'start' is always the lower bound
            this.start = end;
            this.end = start;
        } else {
            this.start = start;
            this.end = end;
        }
    }

    /** Returns true if this range includes the specified number within its bounds. */
    public includes(num: number): boolean {
        return num >= this.start && num <= this.end;
    }

    /**
     * Returns true if any part of the specified range falls within the bounds of this range.
     */
    public intersects(range: AocRange): boolean {
        return this.includes(range.start) || this.includes(range.end) || range.contains(this);
    }

    /** Creates a new range object that represents the intersection between two ranges */
    public intersection(range: AocRange): AocRange | null {
        if (!this.intersects(range)) return null;
        return new AocRange(Math.max(this.start, range.start), Math.min(this.end, range.end));
    }

    /** Returns true if this range includes the specified range entirely within its bounds. */
    public contains(range: AocRange): boolean {
        return this.includes(range.start) && this.includes(range.end);
    }

    public toString(): string {
        return `[${this.start},${this.end}]`;
    }

    /** Simple comparator that can be passed to Array.sort() and orders Ranges by ascending start */
    public static ascendingComparator(a: AocRange, b: AocRange): number {
        return a.start - b.start;
    }
}

export default AocRange;
