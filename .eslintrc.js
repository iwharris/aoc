module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2019,
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint', 'prettier'],
    env: {
        node: true,
        commonjs: true,
        es6: true,
    },
    extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
    rules: {
        'prettier/prettier': 'warn',
        'no-console': ['error', { allow: ['warn', 'error'] }],
        'no-fallthrough': 'warn',
        'no-unsafe-finally': 'warn',
        'no-useless-escape': 'warn',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-inferrable-types': 'warn',
        '@typescript-eslint/no-require-imports': 'off',
        '@typescript-eslint/no-unused-expressions': 'off',
        '@typescript-eslint/no-unused-vars': ['warn', { caughtErrors: 'none' }],
    },
    ignorePatterns: ['dist'],
};
