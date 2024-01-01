import { BaseSolution } from '../solution';
import { Input } from '../types';
import { product, sum } from '../util/fp';

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

        return solvePart2(workflowMap).toString();
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

/** Upper and lower bounds for each property (inclusive) */
type Range = Record<PartKey, [number, number]>;

const duplicateRange = (range: Range) => JSON.parse(JSON.stringify(range));

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

        const rules: Rule[] = ruleComponents.slice(0, -1).map((component) => {
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

const getAcceptedRangesForWorkflow = (
    workflowMap: WorkflowMap,
    id: string,
    range: Range
): Range[] => {
    if (id === 'R') return [];
    else if (id === 'A') return [duplicateRange(range)];

    const workflow = workflowMap[id];

    const newRanges: Range[] = [];

    workflow.rules.forEach((rule) => {
        if (rule.operator === '<') {
            const newRange = duplicateRange(range);
            newRange[rule.operand][1] = rule.value - 1; // clamp the max down to 1 less than the rule value
            newRanges.push(...getAcceptedRangesForWorkflow(workflowMap, rule.next, newRange));
            range[rule.operand][0] = rule.value;
        }

        if (rule.operator === '>') {
            const newRange = duplicateRange(range);
            newRange[rule.operand][0] = rule.value + 1; // clamp the min to 1 greater than the rule value
            newRanges.push(...getAcceptedRangesForWorkflow(workflowMap, rule.next, newRange));
            range[rule.operand][1] = rule.value;
        }
    });

    // handle last rule
    newRanges.push(
        ...getAcceptedRangesForWorkflow(workflowMap, workflow.next, duplicateRange(range))
    );

    return newRanges;
};

const solvePart2 = (workflowMap: WorkflowMap): number => {
    const initialRange: Range = {
        x: [1, 4000],
        m: [1, 4000],
        a: [1, 4000],
        s: [1, 4000],
    };

    const ranges = getAcceptedRangesForWorkflow(workflowMap, 'in', initialRange);

    // return sum(
    //     ranges.map((range) => product(Object.values(range).map(([min, max]) => max - min + 1)))
    // );

    // console.log(ranges);

    return ranges
        .map((range) => Object.values(range).reduce((acc, [min, max]) => acc * (max - min + 1), 1))
        .reduce((acc: number, v: number) => acc + v, 0);
};
