import { BaseSolution, Input } from '../solution';
import { sum } from '../util/fp';

export class Solution extends BaseSolution {
    public description = `
    --- Day 18: Operation Order ---

    As you look out the window and notice a heavily-forested continent slowly appear over the horizon, you are interrupted by the child sitting next to you. They're curious if you could help them with their math homework.

    Unfortunately, it seems like this "math" follows different rules than you remember.

    The homework (your puzzle input) consists of a series of expressions that consist of addition (+), multiplication (*), and parentheses ((...)). Just like normal math, parentheses indicate that the expression inside must be evaluated before it can be used by the surrounding expression. Addition still finds the sum of the numbers on both sides of the operator, and multiplication still finds the product.

    However, the rules of operator precedence have changed. Rather than evaluating multiplication before addition, the operators have the same precedence, and are evaluated left-to-right regardless of the order in which they appear.

    For example, the steps to evaluate the expression 1 + 2 * 3 + 4 * 5 + 6 are as follows:

    1 + 2 * 3 + 4 * 5 + 6
      3   * 3 + 4 * 5 + 6
          9   + 4 * 5 + 6
             13   * 5 + 6
                 65   + 6
                     71
    Parentheses can override this order; for example, here is what happens if parentheses are added to form 1 + (2 * 3) + (4 * (5 + 6)):

    1 + (2 * 3) + (4 * (5 + 6))
    1 +    6    + (4 * (5 + 6))
         7      + (4 * (5 + 6))
         7      + (4 *   11   )
         7      +     44
                51
    Here are a few more examples:

    2 * 3 + (4 * 5) becomes 26.
    5 + (8 * 3 + 9 + 3 * 4 * 3) becomes 437.
    5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4)) becomes 12240.
    ((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2 becomes 13632.
    Before you can help with the homework, you need to understand it yourself. Evaluate the expression on each line of the homework; what is the sum of the resulting values?

    --- Part Two ---

    You manage to answer the child's questions and they finish part 1 of their homework, but get stuck when they reach the next section: advanced math.

    Now, addition and multiplication have different precedence levels, but they're not the ones you're familiar with. Instead, addition is evaluated before multiplication.

    For example, the steps to evaluate the expression 1 + 2 * 3 + 4 * 5 + 6 are now as follows:

    1 + 2 * 3 + 4 * 5 + 6
    3   * 3 + 4 * 5 + 6
    3   *   7   * 5 + 6
    3   *   7   *  11
        21       *  11
            231
    Here are the other examples from above:

    1 + (2 * 3) + (4 * (5 + 6)) still becomes 51.
    2 * 3 + (4 * 5) becomes 46.
    5 + (8 * 3 + 9 + 3 * 4 * 3) becomes 1445.
    5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4)) becomes 669060.
    ((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2 becomes 23340.
    `;

    solvePart1(lines: Input): string {
        const equations = parse(lines);
        // console.log(JSON.stringify(equations, null, 2))
        const results = equations.map((e) => e.evaluateLeftToRight());
        // console.log(results);
        return sum(results).toString();
    }

    solvePart2(lines: Input): string {
        const equations = parse(lines);
        // console.log(JSON.stringify(equations, null, 2))
        const results = equations.map((e) => e.evaluateAdditionFirst());

        // console.log(results);
        // console.log(results);
        return sum(results).toString();
    }
}

const parse = (raw: Input): Equation[] => {
    const input = raw.map((line) => line.replace(/\s/g, '')); // strip all whitespace from line

    // parse equation using stack
    return input.map((line) => {
        let curEquation = new Equation();
        const stack: Equation[] = [curEquation];
        let curDigits: string[] = [];
        let curOperator: Operator | null = Operator.ADD;

        const pushNumericValue = (): void => {
            if (curDigits.length > 0) {
                const v = parseInt(curDigits.join(''));
                // add element to current equation
                curEquation.add(curOperator as Operator, v);

                curDigits = []; // reset digit accumulator
                curOperator = null; // reset operator
            }
        };

        for (let i = 0; i < line.length; i++) {
            const c = line.charAt(i);
            // console.log(`cur char is ${c}`)
            if (/\d/.test(c)) {
                curDigits.push(c);
            } else {
                pushNumericValue();

                if (isOperator(c)) {
                    curOperator = c as Operator;
                } else if (c === '(') {
                    // open new equation
                    stack.push(curEquation);
                    const newEquation = new Equation();
                    // push new equation as an element in cur equation
                    curEquation.add(curOperator as Operator, newEquation);
                    curEquation = newEquation;
                    curOperator = Operator.ADD;
                } else if (c === ')') {
                    // we finished the current parentheses block

                    const popped = stack.pop();
                    if (!popped) throw new Error('popped too much');
                    curEquation = popped;
                }
            }
        }

        pushNumericValue(); // push number if it was the last thing in the line

        return curEquation;
    });
};

class Equation {
    private elements: Element[] = [];

    add(operator: Operator, value: Value): void {
        // console.log(`pushing ${operator}`)
        this.elements.push({
            operator,
            value,
        });
    }

    evaluateLeftToRight(): number {
        return this.elements.reduce((acc, elem) => {
            const { operator, value } = elem;
            const val = value instanceof Equation ? value.evaluateLeftToRight() : value;
            return Operation[operator](acc, val);
        }, 0);
    }

    evaluateAdditionFirst(): number {
        // do a pass over the addition operations first
        const elemsAfterAddition: Element[] = [];

        const evaluateElement = (elem: Element): number =>
            elem.value instanceof Equation ? elem.value.evaluateAdditionFirst() : elem.value;

        const mergeElements = (prevElement: Element, curElement: Element): void => {
            const newVal = evaluateElement(curElement);
            const oldVal = evaluateElement(prevElement);

            prevElement.value = Operation[Operator.ADD](oldVal, newVal);
        };

        for (let i = 0; i < this.elements.length; i++) {
            const currentElem = this.elements[i];
            currentElem.value = evaluateElement(currentElem);
            if (currentElem.operator === Operator.ADD) {
                // add this with the previous element if one exists
                const [lastElem] = elemsAfterAddition.slice(-1);
                if (lastElem) {
                    mergeElements(lastElem, currentElem);
                } else {
                    elemsAfterAddition.push(currentElem);
                }
            } else {
                elemsAfterAddition.push(currentElem);
            }
        }

        this.elements = elemsAfterAddition; // hack: just modify elements

        // console.log(`${JSON.stringify(this.elements, null, 2)}`);

        // with all additions done, return multiplications normally
        return this.evaluateLeftToRight();
    }
}

const isOperator = (char: string): boolean => Object.values(Operator).includes(char as Operator);

enum Operator {
    ADD = '+',
    MULTIPLY = '*',
}

const Operation: Record<Operator, (acc: number, cur: number) => number> = {
    [Operator.ADD]: (acc, cur) => acc + cur,
    [Operator.MULTIPLY]: (acc, cur) => acc * cur,
};

type Value = number | Equation;

interface Element {
    operator: Operator;
    value: Value;
}
