import { defineFlatConfig } from 'eslint-define-config';
import vuePlugin from 'eslint-plugin-vue';
import vue3Config from 'eslint-plugin-vue/lib/configs/vue3-recommended.js';
import vueParser from 'vue-eslint-parser';
import tsParser from '@typescript-eslint/parser';

export default defineFlatConfig([
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 2022,
        sourceType: 'module',
      },
    },
    plugins: {
      vue: vuePlugin,
    },
    rules: {
      ...vue3Config.rules,
      quotes: ['error', 'single'],
    },
  },
  {
    files: ['**/*.ts', '**/*.js'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    rules: {
      quotes: ['error', 'single'],
    },
  },
]);
