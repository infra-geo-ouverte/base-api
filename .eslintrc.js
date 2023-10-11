/* eslint-env node */
module.exports = {
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', "unused-imports"],
    root: true,
    rules: {
        "@typescript-eslint/no-unused-vars": [
            "error",
            { 
              "argsIgnorePattern": "^_",
              "caughtErrorsIgnorePattern": "^_"
            }
        ]
    }
};