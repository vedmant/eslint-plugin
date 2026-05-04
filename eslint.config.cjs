'use strict'

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
      '@vedmant': eslintPluginVedmant,
    },
    // Do NOT add a processor here — vue-eslint-parser must be the active parser
    // for template visitors (defineTemplateBodyVisitor) to work.
    rules: {
      '@vedmant/vue-start-tag-single-line': 'error',
    },
  },
]
