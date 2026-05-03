# eslint-plugin-vedmant

ESLint rules used in vedmant projects. Currently includes layout rules for Vue single-file components.

## Install

```bash
npm install eslint-plugin-vedmant --save-dev
```

Peer dependencies (your project should already have these if you lint Vue):

- `eslint` `^8.57.0` or `^9.0.0`
- `eslint-plugin-vue` `^9.0.0`

## Usage (ESLint flat config)

```js
// eslint.config.js
const eslintPluginVue = require('eslint-plugin-vue')
const vueEslintParser = require('vue-eslint-parser')
const vedmant = require('eslint-plugin-vedmant')

module.exports = [
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueEslintParser,
      parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
    },
    plugins: {
      vue: eslintPluginVue,
      vedmant,
    },
    processor: eslintPluginVue.processors['.vue'],
    rules: {
      'vedmant/vue-start-tag-single-line': 'error',
    },
  },
]
```

### Rule options

`vedmant/vue-start-tag-single-line` — prefer a single-line opening tag when the attribute count and compact line length are within limits.

- `maxAttributes` (default `5`) — only suggest one line when there are at most this many attributes.
- `maxLineLength` (default `300`) — only report when the collapsed tag fits within this many characters.

Example:

```js
'vedmant/vue-start-tag-single-line': ['error', { maxAttributes: 5, maxLineLength: 120 }]
```

## Development

```bash
npm install
npm test
```

## License

MIT
