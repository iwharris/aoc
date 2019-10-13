import { Solution } from '../challenge';

export function getName(solution: Solution) {
    const matches = /^[\n -]*Day \d+:([\w\s]+)[ -]*\n/.exec(solution.description);
    if (!matches) throw new Error('Description is malformed');
    return matches[1].trim();
}
