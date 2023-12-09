export const gcd = (a: number, b: number): number => {
    for (let temp = b; b !== 0; ) {
        b = a % b;
        a = temp;
        temp = b;
    }
    return a;
};

const _lcm = (a: number, b: number): number => {
    const gcdValue = gcd(a, b);
    return (a * b) / gcdValue;
};

export const lcm = (...numbers: number[]): number =>
    numbers.reduce((acc, cur) => _lcm(acc, cur), 1);
