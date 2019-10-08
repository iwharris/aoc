export function parseNameFromDescription(description: string) {
    const matches = /^[\n -]*Day \d+:([\w\s]+)[ -]*\n/.exec(description);
    if (!matches) throw new Error('wat');
    return matches[1].trim();
}