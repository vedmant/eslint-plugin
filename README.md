# @vedmant/eslint-plugin

ESLint rules used in vedmant projects. Currently includes layout rules for Vue single-file components.

## Install

```bash
yarn add -D @vedmant/eslint-plugin
```

Peer dependencies (install these if not already present):

- `eslint` `^8.57.0`, `^9.0.0`, or `^10.0.0`
- `vue-eslint-parser` `>=9.0.0`

## Usage (ESLint flat config)

```js
// eslint.config.js
const vueEslintParser = require('vue-eslint-parser')
const vedmantEslintPlugin = require('@vedmant/eslint-plugin')

module.exports = [
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueEslintParser,
      parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
    },
    plugins: {
      '@vedmant': vedmantEslintPlugin,
    },
    // Do NOT add a processor here — vue-eslint-parser must be the active parser
    // for template visitors (defineTemplateBodyVisitor) to work.
    rules: {
      '@vedmant/vue-start-tag-single-line': 'error',
    },
  },
]
```

### Rule options

`@vedmant/vue-start-tag-single-line` — prefer a single-line opening tag when the attribute count and compact line length are within limits.

- `maxAttributes` (default `5`) — only suggest one line when there are at most this many attributes.
- `maxLineLength` (default `300`) — only report when the collapsed tag fits within this many characters.

Example:

```js
'@vedmant/vue-start-tag-single-line': ['error', { maxAttributes: 5, maxLineLength: 120 }]
```

## Development

```bash
yarn install
yarn test
```

## License

MIT
