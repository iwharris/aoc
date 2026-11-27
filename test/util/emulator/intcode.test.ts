import { IntcodeEmulator } from '../../../src/util/emulator/intcode';

describe('IntcodeEmulator', () => {
    const emulator = (program: string) => new IntcodeEmulator([program]);

    it('should add, multiply and advance', () => {
        const e = emulator('1,0,0,0,2,0,0,0,99');

        e.step();
        e.step();

        expect(e.memory[0]).toBe(4);
        expect(e.pc).toBe(8);
    });

    it('should signal a halt', () => {
        expect.assertions(1);
        try {
            emulator('99').step();
        } catch (signal) {
            expect(signal).toEqual({ halt: true });
        }
    });

    it('should signal an unknown opcode as an error', () => {
        expect.assertions(1);
        try {
            emulator('7,0,0,0').step();
        } catch (signal) {
            expect(signal.error.message).toBe('Unknown opcode 7 at index 0');
        }
    });
});
