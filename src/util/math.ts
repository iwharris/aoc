export const gcd = (a: number, b: number): number => {
    // Handle edge case where both numbers are 0
    if (a === 0 && b === 0) return 0;

    // Euclidean algorithm
    while (b !== 0) {
        const temp = b;
        b = a % b;
        a = temp;
    }
    return a;
};

const _lcm = (a: number, b: number): number => {
    // Handle edge case where either number is 0
    if (a === 0 || b === 0) return 0;

    const gcdValue = gcd(a, b);
    return (a * b) / gcdValue;
};

export const lcm = (...numbers: number[]): number =>
    numbers.reduce((acc, cur) => _lcm(acc, cur), 1);
