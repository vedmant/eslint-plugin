'use strict'

/**
 * Minimal ESLint config for plugin tests only (@vedmant/vue-start-tag-single-line + vue base).
 * Resolves @vedmant/eslint-plugin to this package without publishing to npm.
 *
 * For ESLint 9+, use flat config (see `eslint.config.cjs`). To run this legacy config:
 *   ESLINT_USE_FLAT_CONFIG=false npx eslint -c __tests__/eslintrc.minimal.cjs ...
 */
const Module = require('module')
const path = require('path')

const originalResolveFilename = Module._resolveFilename
Module._resolveFilename = function patchedResolveFilename (request, parent, isMain, options) {
  if (request === '@vedmant/eslint-plugin') {
    return path.join(__dirname, '../index.js')
  }
  return originalResolveFilename.call(this, request, parent, isMain, options)
}

module.exports = {
  root: true,
  env: { es2021: true, browser: true },
  extends: ['plugin:vue/base'],
  parser: 'vue-eslint-parser',
  parserOptions: { ecmaVersion: 'latest' },
  plugins: ['@vedmant'],
  rules: {
    '@vedmant/vue-start-tag-single-line': ['error', { maxAttributes: 5, maxLineLength: 300 }],
  },
}
