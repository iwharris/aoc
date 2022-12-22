import { BaseSolution } from '../solution';
import { Input } from '../types';

export class Solution extends BaseSolution {
    description = `
    --- Day 21: Monkey Math ---
    The monkeys are back! You're worried they're going to try to steal your stuff again, but it seems like they're just holding their ground and making various monkey noises at you.
    
    Eventually, one of the elephants realizes you don't speak monkey and comes over to interpret. As it turns out, they overheard you talking about trying to find the grove; they can show you a shortcut if you answer their riddle.
    
    Each monkey is given a job: either to yell a specific number or to yell the result of a math operation. All of the number-yelling monkeys know their number from the start; however, the math operation monkeys need to wait for two other monkeys to yell a number, and those two other monkeys might also be waiting on other monkeys.
    
    Your job is to work out the number the monkey named root will yell before the monkeys figure it out themselves.
    
    For example:
    
    root: pppw + sjmn
    dbpl: 5
    cczh: sllz + lgvd
    zczc: 2
    ptdq: humn - dvpt
    dvpt: 3
    lfqf: 4
    humn: 5
    ljgn: 2
    sjmn: drzm * dbpl
    sllz: 4
    pppw: cczh / lfqf
    lgvd: ljgn * ptdq
    drzm: hmdt - zczc
    hmdt: 32
    Each line contains the name of a monkey, a colon, and then the job of that monkey:
    
    A lone number means the monkey's job is simply to yell that number.
    A job like aaaa + bbbb means the monkey waits for monkeys aaaa and bbbb to yell each of their numbers; the monkey then yells the sum of those two numbers.
    aaaa - bbbb means the monkey yells aaaa's number minus bbbb's number.
    Job aaaa * bbbb will yell aaaa's number multiplied by bbbb's number.
    Job aaaa / bbbb will yell aaaa's number divided by bbbb's number.
    So, in the above example, monkey drzm has to wait for monkeys hmdt and zczc to yell their numbers. Fortunately, both hmdt and zczc have jobs that involve simply yelling a single number, so they do this immediately: 32 and 2. Monkey drzm can then yell its number by finding 32 minus 2: 30.
    
    Then, monkey sjmn has one of its numbers (30, from monkey drzm), and already has its other number, 5, from dbpl. This allows it to yell its own number by finding 30 multiplied by 5: 150.
    
    This process continues until root yells a number: 152.
    
    However, your actual situation involves considerably more monkeys. What number will the monkey named root yell?

    --- Part Two ---
    Due to some kind of monkey-elephant-human mistranslation, you seem to have misunderstood a few key details about the riddle.
    
    First, you got the wrong job for the monkey named root; specifically, you got the wrong math operation. The correct operation for monkey root should be =, which means that it still listens for two numbers (from the same two monkeys as before), but now checks that the two numbers match.
    
    Second, you got the wrong monkey for the job starting with humn:. It isn't a monkey - it's you. Actually, you got the job wrong, too: you need to figure out what number you need to yell so that root's equality check passes. (The number that appears after humn: in your input is now irrelevant.)
    
    In the above example, the number you need to yell to pass root's equality test is 301. (This causes root to get the same number, 150, from both of its monkeys.)
    
    What number do you yell to pass root's equality test?
    `;

    public solvePart1(lines: Input): string {
        const m = parseMonkeyMap(lines);
        return solvePart1(m).toString();
    }

    public solvePart2(lines: Input): string {
        const m = parseMonkeyMap(lines);

        // const root = pruneOps(buildTree(m)) as OpNode;

        // printTree(root);

        return solvePart2(m).toString();
    }
}

const parseMonkeyMap = (lines: Input): MonkeyMap => {
    const m: MonkeyMap = {};

    lines.forEach((line) => {
        const [id, suffix] = line.split(': ');

        if (/^(\d+)$/gm.test(suffix)) {
            m[id] = Number(suffix);
        } else {
            const [left, op, right] = suffix.split(' ');
            m[id] = { left, right, op: op as Op };
        }
    });

    return m;
};

const solvePart1 = (map: MonkeyMap): number => {
    const s = (id: string): number => {
        const m = map[id];
        return typeof m === 'number' ? m : OPERATIONS[m.op](s(m.left), s(m.right));
    };

    return s('root');
};

type MonkeyMap = Record<string, number | MonkeyOp>;
type MonkeyOp = { left: string; right: string; op: Op };

type OperationCallback = (a: number, b: number) => number;
type Op = '+' | '-' | '*' | '/';

const OPERATIONS: Record<Op, OperationCallback> = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => a / b,
};

const reverseOperators: Record<Op, Record<'true' | 'false', OperationCallback>> = {
    '+': {
        true: (a, b) => a - b,
        false: (a, b) => a - b,
    },
    '-': {
        true: (a, b) => a + b,
        false: (a, b) => b - a,
    },
    '*': {
        true: (a, b) => a / b,
        false: (a, b) => a / b,
    },
    '/': {
        true: (a, b) => a * b,
        false: (a, b) => b / a,
    },
};

// reverse_operators = {
//     ('+', True): lambda c, x: c - x,
//     ('-', True): lambda c, x: c + x,
//     ('*', True): lambda c, x: c / x,
//     ('/', True): lambda c, x: c * x,

//     ('+', False): lambda c, x: c - x,
//     ('-', False): lambda c, x: x - c,
//     ('*', False): lambda c, x: c / x,
//     ('/', False): lambda c, x: x / c,

// }

// part 2

// const buildTree = (m: MonkeyMap): OpNode => {
//     const r = (id: string): TreeNode => {
//         const n = m[id];
//         if (typeof n === 'number') return { id, val: n, type: 'leaf' } as LeafNode;
//         else return { id, left: r(n.left), right: r(n.right), op: n.op, type: 'op' } as OpNode;
//     };

//     return r('root') as OpNode;
// };

// const pruneOps = (thisNode: OpNode): TreeNode => {
//     const { id, op } = thisNode;

//     if (thisNode.left.type === 'op') {
//         const newLeft = pruneOps(thisNode.left);
//         thisNode.left = newLeft;
//     }

//     if (thisNode.right.type === 'op') {
//         const newRight = pruneOps(thisNode.right);
//         thisNode.right = newRight;
//     }

//     if (
//         thisNode.left.type === 'leaf' &&
//         thisNode.right.type === 'leaf' &&
//         !(thisNode.left.id === 'humn' || thisNode.right.id === 'humn')
//     ) {
//         // we can convert the OpNode into a LeafNode
//         const newVal = OPERATIONS[op](thisNode.left.val, thisNode.right.val);
//         // console.log(
//         //     `simplifying node "${id}" from "${thisNode.left.val} ${op} ${thisNode.right.val}" into ${newVal}`
//         // );
//         return { id, type: 'leaf', val: newVal };
//     } else {
//         // console.log(`cannot simplify node ${id}`);
//         return thisNode;
//     }
// };

const solvePart2 = (m: MonkeyMap): number => {
    const known: Record<string, number | null> = {};

    const operations: Record<string, MonkeyOp> = {};

    for (const [id, item] of Object.entries(m)) {
        if (typeof item === 'number') known[id] = item;
        else operations[id] = item;
    }

    known.humn = null;

    const { left, right } = operations.root;

    const propagate = (target: string) => {
        while (known[target] === undefined) {
            for (const [id, { left, right, op }] of Object.entries(operations)) {
                if (known[id] !== undefined) continue;

                if (known[left] !== undefined && known[right] !== undefined) {
                    const leftVal = known[left];
                    const rightVal = known[right];
                    const val =
                        leftVal === null || rightVal === null
                            ? null
                            : OPERATIONS[op](leftVal, rightVal);
                    known[id] = val;
                }
            }
        }
    };

    propagate(left);
    propagate(right);

    let target: string;
    let current: number;

    // prepare our target
    if (known[left] === null) {
        target = left;
        current = known[right] as number;
    } else {
        target = right;
        current = known[left] as number;
    }

    // go down the tree using inverses
    while (target !== 'humn') {
        const { left, op, right } = operations[target];
        if (known[left] === null) {
            target = left;
            current = reverseOperators[op].true(current, known[right]!);
        }
        if (known[right] === null) {
            target = right;
            current = reverseOperators[op].false(current, known[left]!);
        }
    }

    return current;
};

/*
def solve(data):

    # make 'humn' None, and solve for the childs of root
    known['humn'] = None
    first, _, second = operations['root']

    propagate(first, known, operations)
    propagate(second, known, operations)

    # prepare our target
    if known[first] is None:
        target = first
        current = known[second]
    else:
        target = second
        current = known[first]

    # go down the tree using inverses
    while target != 'humn':
        a, op, b = operations[target]

        if known[a] is None:
            target = a
            current = reverse_operators[(op, True)](current, known[b])
        if known[b] is None:
            target = b
            current = reverse_operators[(op, False)](current, known[a])

    solution = int(current)
    return 
*/

// const solvePart2 = (root: OpNode): number => {
//     const solve = (node: OpNode, targetValue: number): number => {
//         const opChild = node.left.type === 'op' ? node.left : (node.right as OpNode);
//         const valueChild = node.left.type === 'leaf' ? node.left : (node.right as LeafNode);

//         if (node.id === 'humn') {
//             console.log(`we made it - targetVal is ${targetValue}`);
//         }
//         console.log(`[${node.id}] op=${node.op} target=${targetValue}`);
//         switch (node.op) {
//             case '+':
//                 // left + right = targetValue: order of operations does not matter
//                 console.log(`[${node.id}][op=+]: target=${targetValue} - ${valueChild.val}`);
//                 return solve(opChild, targetValue - valueChild.val);
//             case '-':
//                 // left - right = targetValue: order of operations matters
//                 if (node.left.type === 'op' && node.right.type === 'leaf') {
//                     // left = targetValue + right
//                     return solve(node.left, targetValue + node.right.val);
//                 } else if (node.left.type === 'leaf' && node.right.type === 'op') {
//                     // right = left - targetValue
//                     return solve(node.right, node.left.val - targetValue);
//                 }
//                 break;
//             // throw new Error('Unexpected edge case for subtraction');
//             case '*':
//                 // left * right = targetValue: order of operations does not matter
//                 return solve(opChild, targetValue / valueChild.val);
//             case '/':
//                 // left / right = targetValue: order of operations matters
//                 if (node.left.type === 'op' && node.right.type === 'leaf') {
//                     // left = targetValue * right
//                     return solve(node.left, targetValue * node.right.val);
//                 } else if (node.left.type === 'leaf' && node.right.type === 'op') {
//                     // right = left / targetValue
//                     return solve(node.right, node.left.val / targetValue);
//                 }
//                 break;
//             // throw new Error('Unexpected edge case for division');
//         }
//         throw new Error(`unexpected edge case at ${node.id}`);
//     };

//     return solve(root, 0);
// };

// const printTree = (root: OpNode): void => {
//     const p = (node: TreeNode, indent = 0) => {
//         const prefix = node.id.padStart(indent + 4, ' ');
//         if (node.type === 'op') {
//             console.log(`${prefix}: [${node.op}]`);
//             p(node.left, indent + 1);
//             p(node.right, indent + 1);
//         } else {
//             if (node.id === 'humn') console.log(`${prefix}: !!!HUMAN!!!`);
//             else console.log(`${prefix}: [${node.val}]`);
//         }
//     };

//     p(root);
// };

// type TreeNode = LeafNode | OpNode;

// type LeafNode = { id: string; type: 'leaf'; val: number };
// type OpNode = {
//     id: string;
//     type: 'op';
//     left: TreeNode;
//     right: TreeNode;
//     op: Op;
// };
