import js from '@eslint/js';
import globals from 'globals';

const tsParser = (await import('@typescript-eslint/parser')).default;
const tsPlugin = (await import('@typescript-eslint/eslint-plugin')).default;
const importPlugin = (await import('eslint-plugin-import')).default;
const unusedImports = (await import('eslint-plugin-unused-imports')).default;

export default [
    {
        ignores: ['**/*.js', 'node_modules/**', 'dist/**', 'build/**', 'public/js/**', 'public/css/**', 'src/libs/**']
    },
    {
        files: ['**/*.ts', '**/*.tsx'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {},
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {...globals.browser, ...globals.es2021, $: 'readonly', jQuery: 'readonly'},
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
            import: importPlugin,
            'unused-imports': unusedImports,
        },
        settings: {
            'import/resolver': {typescript: {alwaysTryTypes: true, project: ['./tsconfig.json']}},
        },
        rules: {
            ...js.configs.recommended.rules,
            ...tsPlugin.configs.recommended.rules,
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': ['warn', {argsIgnorePattern: '^_', varsIgnorePattern: '^_'}],
            '@typescript-eslint/no-explicit-any': 'off',
            'unused-imports/no-unused-imports': 'error',
            'import/order': 'off',
            'no-var': 'error',
            'prefer-const': 'warn',
            eqeqeq: ['warn', 'smart'],
        },
    },
];