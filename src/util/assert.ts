export const assert = (val: boolean) => {
    if (!val) throw new Error(`AssertionError: Expected ${val} to be true but got false instead`);
};
