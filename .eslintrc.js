module.exports = {
    extends: [
        '@iwharris/eslint-config',
        'eslint:recommended',
        'plugin:prettier/recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
    ],

    rules: {
        'no-console': ['error', { allow: ['warn', 'error'] }],
        'no-fallthrough': ['warn'],
        'no-unsafe-finally': ['warn'],
        'no-useless-escape': ['warn'],
        '@typescript-eslint/no-inferrable-types': ['warn'],
    },

    ignorePatterns: ['dist'],
};
