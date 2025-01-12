/**
 * Convenience function that returns all matches for a given pattern in the input string.
 * If there are no matches, returns an empty array.
 */
export const extractAllMatches = (input: string, regex: RegExp): string[] =>
    input.match(new RegExp(regex, 'g')) ?? [];
