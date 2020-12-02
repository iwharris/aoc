export const countSubstringOccurrences = (string: string, substr: string): number => {
    const match = string.match(new RegExp(substr, 'g')) || [];
    return match.length;
};
