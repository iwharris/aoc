import { BaseSolution } from '../solution';
import { Input } from '../types';
import { sum } from '../util/fp';

export class Solution extends BaseSolution {
    preserveEmptyLines = true;

    description = ``;

    public solvePart1(lines: Input): string {
        const [workflowMap, parts] = parseInput(lines);

        return sum(
            parts.filter((part) => getOutcome(part, workflowMap) === 'A').map(getScore)
        ).toString();
    }

    public solvePart2(lines: Input): string {
        const [workflowMap] = parseInput(lines);
        let counter = 0;
        for (let x = 1; x <= 4000; x++) {
            for (let m = 1; m <= 4000; m++) {
                console.log(`x=${x} m=${m}`);
                for (let a = 1; a <= 4000; a++) {
                    for (let s = 1; s <= 4000; s++) {
                        if (getOutcome({ x, m, a, s }, workflowMap)) counter += 1;
                    }
                }
            }
        }
        return counter.toString();
    }
}

type PartKey = 'x' | 'm' | 'a' | 's';
type Part = Record<PartKey, number>;

type Workflow = {
    id: string;
    rules: Rule[];
    next: string;
};
type WorkflowMap = Record<string, Workflow>;
type RuleOperator = '>' | '<';

type Rule = {
    operand: PartKey;
    operator: RuleOperator;
    value: number;
    next: string;
};

const getScore = (part: Part) => sum(Object.values(part));

const matchesRule = (part: Part, rule: Rule): boolean => {
    return rule.operator === '>'
        ? part[rule.operand] > rule.value
        : part[rule.operand] < rule.value;
};

const evaluateWorkflow = (part: Part, workflow: Workflow): string => {
    for (const rule of workflow.rules) {
        if (matchesRule(part, rule)) {
            return rule.next;
        }
    }
    return workflow.next;
};

const getOutcome = (part: Part, workflowMap: WorkflowMap): 'A' | 'R' => {
    let currentId = 'in';
    while (currentId !== 'A' && currentId !== 'R') {
        const workflow = workflowMap[currentId];
        currentId = evaluateWorkflow(part, workflow);
    }

    return currentId;
};
const parseInput = (lines: Input): [WorkflowMap, Part[]] => {
    const [workflowLines, partLines] = lines
        .join('\n')
        .split('\n\n')
        .map((block) => block.trim().split('\n'));

    const workflowMap: WorkflowMap = {};
    for (const line of workflowLines) {
        const [id, rest] = line.split('{');
        const ruleStr = rest.substring(0, rest.length - 1);
        const ruleComponents = ruleStr.split(',');
        const next = ruleComponents[ruleComponents.length - 1];

        const rules: Rule[] = ruleComponents.slice(0, -1).map((component, i, arr) => {
            // eg. a<2006:qkq
            const [valueStr, next] = component.slice(2).split(':');
            return {
                operand: component[0] as PartKey,
                operator: component[1] as RuleOperator,
                value: parseInt(valueStr),
                next,
            };
        });

        workflowMap[id] = {
            id,
            rules,
            next,
        };
    }

    const parts: Part[] = partLines.map((line) => {
        const components = line.substring(1, line.length - 1).split(',');

        return components.reduce<Part>((acc, currentStr) => {
            acc[currentStr[0]] = parseInt(currentStr.substring(2));
            return acc;
        }, {} as Part);
    });

    // console.log(JSON.stringify(workflowMap, null, 2));
    return [workflowMap, parts];
};
