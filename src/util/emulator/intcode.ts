import { Input } from '../../types';

enum Opcode {
    ADD = 1,
    MULTIPLY = 2,
    TERMINATE = 99,
}

export interface EmulatorSignal {
    halt?: boolean;
    error?: Error;
}

export interface State {
    memory: number[];

    // registers
    // acc: number;
    pc: number;
}

export class IntcodeEmulator implements State {
    private readonly instructionWidth: number = 4;

    public memory: number[];
    // public acc: number;
    public pc: number;

    constructor(program: Input) {
        this.memory = program[0].split(',').map((num) => parseInt(num));
        // this.acc = 0;
        this.pc = 0;
    }

    step() {
        try {
            const [opcode, arg1, arg2, dest] = this.memory.slice(
                this.pc,
                this.pc + this.instructionWidth
            );
            const mutator = instructions[opcode];

            if (!mutator) throw new Error(`Unknown opcode ${opcode} at index ${this.pc}`);

            mutator(this, arg1, arg2, dest); // execute instruction

            this.pc += this.instructionWidth;
        } catch (caught) {
            if (caught instanceof Error) {
                throw { error: caught } as EmulatorSignal;
            } else {
                throw caught as EmulatorSignal;
            }
        }
    }
}

type Mutator = (state: State, argument1: number, argument2: number, dest: number) => void;

const instructions: Record<Opcode, Mutator> = {
    [Opcode.ADD]: (state, arg1, arg2, dest) => {
        const [val1, val2] = [arg1, arg2].map((offset) => state.memory[offset]);
        state.memory[dest] = val1 + val2;
    },
    [Opcode.MULTIPLY]: (state, arg1, arg2, dest) => {
        const [val1, val2] = [arg1, arg2].map((offset) => state.memory[offset]);
        state.memory[dest] = val1 * val2;
    },
    [Opcode.TERMINATE]: () => {
        throw { halt: true } as EmulatorSignal;
    },
};
