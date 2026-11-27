/** Counts non-overlapping occurrences of substr, which is matched literally (not as a regex) */
export const countSubstringOccurrences = (string: string, substr: string): number =>
    substr ? string.split(substr).length - 1 : 0;
