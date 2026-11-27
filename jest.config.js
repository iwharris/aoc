module.exports = {
    testEnvironment: 'node',
    testRegex: '/test/.*\\.(test|spec)?\\.(ts)$',
    moduleFileExtensions: ['ts', 'js'],
    transform: {
        '\\.[jt]sx?$': 'ts-jest',
    },
};
