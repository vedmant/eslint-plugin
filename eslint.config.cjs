'use strict'

const eslintPluginVue = require('eslint-plugin-vue')
const vueEslintParser = require('vue-eslint-parser')
const eslintPluginVedmant = require('./index.js')

/** Local config for running `yarn test` on fixture Vue files only. */
module.exports = [
  {
    files: ['**/__tests__/**/*.vue'],
    languageOptions: {
      parser: vueEslintParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      vue: eslintPluginVue,
      '@vedmant': eslintPluginVedmant,
    },
    processor: eslintPluginVue.processors['.vue'],
    rules: {
      '@vedmant/vue-start-tag-single-line': 'error',
    },
  },
]
