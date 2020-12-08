import { Input } from '../../types';

export type Opcode = 'nop' | 'jmp' | 'acc';

export interface Instruction {
    opcode: Opcode;
    argument: number;
}

const parseProgramLine = (line: string): Instruction => {
    const [opcode, argument] = line.split(' ');

    return { opcode: opcode as Opcode, argument: parseInt(argument) };
};

export interface State {
    memory: Instruction[];
    pc: number;
    acc: number;
}

export class AssemblerEmulator implements State {
    public memory: Instruction[];
    public pc: number;
    public acc: number;

    constructor(program: Input) {
        this.memory = program.map(parseProgramLine);
        this.pc = 0;
        this.acc = 0;
    }

    step() {
        const current = this.memory[this.pc];

        // Execute instruction
        // console.log(`[${this.pc}] ${current.opcode} ${current.argument}`);
        implementation[current.opcode](this, current.argument);

        this.pc += 1;
    }

    dump(): State {
        return this;
    }
}

type Mutator = (state: State, argument: number) => void;

const implementation: Record<Opcode, Mutator> = {
    nop: () => {
        // noop
    },
    acc: (state, argument) => {
        state.acc += argument;
    },
    jmp: (state, argument) => {
        state.pc += argument - 1;
    },
};
