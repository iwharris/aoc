import { BaseSolution, Input } from '../solution';
import { parseInput } from '../util/parser';

export class Solution extends BaseSolution {
    public description = `
    --- Day 19: Monster Messages ---

    You land in an airport surrounded by dense forest. As you walk to your high-speed train, the Elves at the Mythical Information Bureau contact you again. They think their satellite has collected an image of a sea monster! Unfortunately, the connection to the satellite is having problems, and many of the messages sent back from the satellite have been corrupted.
    
    They sent you a list of the rules valid messages should obey and a list of received messages they've collected so far (your puzzle input).
    
    The rules for valid messages (the top part of your puzzle input) are numbered and build upon each other. For example:
    
    0: 1 2
    1: "a"
    2: 1 3 | 3 1
    3: "b"
    Some rules, like 3: "b", simply match a single character (in this case, b).
    
    The remaining rules list the sub-rules that must be followed; for example, the rule 0: 1 2 means that to match rule 0, the text being checked must match rule 1, and the text after the part that matched rule 1 must then match rule 2.
    
    Some of the rules have multiple lists of sub-rules separated by a pipe (|). This means that at least one list of sub-rules must match. (The ones that match might be different each time the rule is encountered.) For example, the rule 2: 1 3 | 3 1 means that to match rule 2, the text being checked must match rule 1 followed by rule 3 or it must match rule 3 followed by rule 1.
    
    Fortunately, there are no loops in the rules, so the list of possible matches will be finite. Since rule 1 matches a and rule 3 matches b, rule 2 matches either ab or ba. Therefore, rule 0 matches aab or aba.
    
    Here's a more interesting example:
    
    0: 4 1 5
    1: 2 3 | 3 2
    2: 4 4 | 5 5
    3: 4 5 | 5 4
    4: "a"
    5: "b"
    Here, because rule 4 matches a and rule 5 matches b, rule 2 matches two letters that are the same (aa or bb), and rule 3 matches two letters that are different (ab or ba).
    
    Since rule 1 matches rules 2 and 3 once each in either order, it must match two pairs of letters, one pair with matching letters and one pair with different letters. This leaves eight possibilities: aaab, aaba, bbab, bbba, abaa, abbb, baaa, or babb.
    
    Rule 0, therefore, matches a (rule 4), then any of the eight options from rule 1, then b (rule 5): aaaabb, aaabab, abbabb, abbbab, aabaab, aabbbb, abaaab, or ababbb.
    
    The received messages (the bottom part of your puzzle input) need to be checked against the rules so you can determine which are valid and which are corrupted. Including the rules and the messages together, this might look like:
    
    0: 4 1 5
    1: 2 3 | 3 2
    2: 4 4 | 5 5
    3: 4 5 | 5 4
    4: "a"
    5: "b"
    
    ababbb
    bababa
    abbbab
    aaabbb
    aaaabbb

    Your goal is to determine the number of messages that completely match rule 0. In the above example, ababbb and abbbab match, but bababa, aaabbb, and aaaabbb do not, producing the answer 2. The whole message must match all of rule 0; there can't be extra unmatched characters in the message. (For example, aaaabbb might appear to match rule 0 above, but it has an extra unmatched b on the end.)
    
    How many messages completely match rule 0?
    `;

    parseInput(raw) {
        return parseInput(raw, { preserveEmptyLines: true });
    }

    solvePart1(lines: Input): string {
        const [ruleMap, strings] = parseAll(lines);
        const tree = createRuleTree(ruleMap, 0); // create rule tree with idx 0 at root
        const raw = tree.compile();
        const regex = new RegExp(`^${raw}$`);

        // console.log(`built regex: ${raw}`);

        const validStrings = strings.filter((s) => regex.test(s));

        // console.log(`valid strings are ${validStrings}`);

        return validStrings.length.toString();
    }

    solvePart2(lines: Input): string {
        return '';
    }
}

const parseAll = (input: Input): [RuleMap, string[]] => {
    const rules: RuleMap = {};

    const splitIndex = input.findIndex((line) => !line);
    // console.log(`splitting at index ${splitIndex}`);
    input
        .slice(0, splitIndex)
        .map(parseRule)
        .forEach(([ruleIdx, rule]) => {
            rules[ruleIdx] = rule;
        });

    const strings = input.slice(splitIndex + 1);

    return [rules, strings];
};

const parseRule = (line: string): [number, RawExpression] => {
    const [idxStr, predicate] = line.split(':').map((s) => s.trim());
    const index = parseInt(idxStr);
    const elements = predicate.replace(/"/g, '').split(' ');
    return [index, elements as RawExpression];
};

type RawExpressionComponent = string;
type RawExpression = RawExpressionComponent[];
type RuleMap = Record<number, RawExpression>;

interface Expression {
    // readonly raw: RawExpressionComponent;
    // readonly isLeaf: boolean;
    compile: () => string; // compile this expression to a regex
}

interface InnerExpression extends Expression {
    push: (expr: Expression) => void;
}

class OrExpression implements InnerExpression {
    // public readonly raw = '|';
    private components: Expression[] = [];

    public push(expr: Expression) {
        this.components.push(expr);
    }

    compile() {
        // console.log(
        //     `OR expression contains components: ${JSON.stringify(this.components, null, 2)}`
        // );
        return `(${this.components.map((c) => c.compile()).join('|')})`;
    }
}

class SequenceExpression implements InnerExpression {
    private components: Expression[] = [];

    public push(expr: Expression) {
        this.components.push(expr);
    }

    compile() {
        return `(${this.components.map((c) => c.compile()).join('')})`;
    }
}

class ValueExpression implements Expression {
    private value: string;

    constructor(val: string) {
        this.value = val;
    }

    compile() {
        return this.value;
    }
}

const createRuleTree = (ruleMap: RuleMap, idx: number): Expression => {
    const rule = ruleMap[idx];
    if (!rule) throw new Error(`cant find rule for idx ${idx}`);

    // console.log(`rule is ${rule}`);
    const exprStack: Expression[] = [];
    for (const elem of rule) {
        // console.log(`elem is ${elem}`);
        if (/[a-z]/.test(elem)) {
            // console.log(`${elem} is leaf`);
            // Leaf nodes have a single value
            exprStack.push(new ValueExpression(elem));
            // return currentExpr`;
        } else if (/\d+/.test(elem)) {
            // is numeric index
            // evaluate the rule with this index
            // console.log(`looked up rule with idx ${elem}`);
            const rule = createRuleTree(ruleMap, parseInt(elem));
            let currentExpr = exprStack.pop();
            if (!currentExpr) {
                // console.log(`adding new sequence starting with elem ${elem}`);
                currentExpr = new SequenceExpression();
            } else if (currentExpr instanceof OrExpression) {
                // console.log(
                //     `adding new sequence to existing OR expression starting with elem ${elem}`
                // );
                // currentExpr is a parent OR expression; replace it with a new Sequence
                const or = currentExpr;
                // if (!or) throw new Error(`popped too much`);
                const newSequence = new SequenceExpression();
                or.push(newSequence);
                exprStack.push(or);
                currentExpr = newSequence;
            }
            (currentExpr as InnerExpression).push(rule);
            exprStack.push(currentExpr);
        } else if (elem === '|') {
            // OR expression
            const currentExpr = exprStack.pop();
            if (!currentExpr) throw new Error(`tried to pop a sequence off the stack`);
            // console.log(`parsed OR`);
            const or = new OrExpression();
            or.push(currentExpr as Expression);
            exprStack.push(or); // parent
        } else {
            throw new Error(`unknown elem "${elem}"`);
        }
    }

    return exprStack[0] as Expression;
};
