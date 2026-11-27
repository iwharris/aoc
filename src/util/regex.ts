/**
 * Convenience function that returns all matches for a given pattern in the input string.
 * If there are no matches, returns an empty array.
 *
 * The regex's flags are respected, and the global flag is added if it's missing. Each result is
 * the full matched text; capture groups are ignored.
 */
export const extractAllMatches = (input: string, regex: RegExp): string[] => {
    const flags = regex.flags.includes('g') ? regex.flags : `${regex.flags}g`;
    return input.match(new RegExp(regex, flags)) ?? [];
};
