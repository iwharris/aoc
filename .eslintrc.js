module.exports = {
    extends: ['@iwharris/eslint-config'],

    rules: {
        'no-console': ['error', { allow: ['warn', 'error'] }],
        'no-fallthrough': ['warn'],
        'no-unsafe-finally': ['warn'],
        'no-unused-vars': 0, // disable this because it's incorrectly flagging Typescript function literals
        'no-useless-escape': ['warn'],
        '@typescript-eslint/no-inferrable-types': ['warn'],
    },

    ignorePatterns: ['dist'],
};
