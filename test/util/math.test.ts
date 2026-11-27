import { gcd, lcm } from '../../src/util/math';

describe('math.ts', () => {
    describe('gcd', () => {
        it('should return 1 for coprime numbers', () => {
            expect(gcd(3, 5)).toBe(1);
            expect(gcd(7, 11)).toBe(1);
            expect(gcd(13, 17)).toBe(1);
        });

        it('should return the smaller number when one divides the other', () => {
            expect(gcd(6, 3)).toBe(3);
            expect(gcd(12, 4)).toBe(4);
            expect(gcd(15, 5)).toBe(5);
        });

        it('should return the GCD for common numbers', () => {
            expect(gcd(12, 18)).toBe(6);
            expect(gcd(24, 36)).toBe(12);
            expect(gcd(100, 75)).toBe(25);
        });

        it('should handle edge cases', () => {
            expect(gcd(0, 5)).toBe(5);
            expect(gcd(5, 0)).toBe(5);
            expect(gcd(0, 0)).toBe(0);
        });
    });

    describe('lcm', () => {
        it('should return the LCM of two numbers', () => {
            expect(lcm(3, 5)).toBe(15);
            expect(lcm(4, 6)).toBe(12);
            expect(lcm(12, 18)).toBe(36);
        });

        it('should handle edge cases', () => {
            expect(lcm(0, 5)).toBe(0);
            expect(lcm(5, 0)).toBe(0);
            expect(lcm(0, 0)).toBe(0);
        });

        it('should handle multiple numbers', () => {
            expect(lcm(2, 3, 4)).toBe(12);
            expect(lcm(3, 4, 6)).toBe(12);
            expect(lcm(2, 4, 8)).toBe(8);
        });
    });
});
