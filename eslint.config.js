// eslint.config.js
import { defineFlatConfig } from 'eslint-define-config';
import js from '@eslint/js';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import globals from 'globals';

export default defineFlatConfig([
  {
    files: ['**/*.ts'],
    ignores: ['node_modules/', 'dist/'], // Replaces .eslintignore
    languageOptions: {
      globals: {
        ...globals.node,
      },
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': ts,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...ts.configs.recommended.rules,
      'no-console': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      "@typescript-eslint/no-explicit-any": "warn"
    },
  },
]);