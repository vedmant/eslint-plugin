'use strict'

/**
 * Asserts that autofix turns `//` inside bound attributes into block comments (`/* … *\/`)
 * when collapsing the opening tag to one line (so merged text stays valid JS).
 */
const assert = require('assert')
const { execFileSync } = require('child_process')
const path = require('path')

const root = path.resolve(__dirname, '..')
const eslintJs = path.join(root, 'node_modules/eslint/bin/eslint.js')
const configPath = path.join(root, 'eslint.config.cjs')
const fixture = path.join(__dirname, 'fixtures/multiline-opening-with-line-comment.vue')

const stdout = execFileSync(process.execPath, [
  eslintJs,
  '-c', configPath,
  '--no-ignore',
  fixture,
  '--fix-dry-run',
  '-f', 'json',
], {
  cwd: root,
  encoding: 'utf8',
})

const [result] = JSON.parse(stdout)
assert.ok(result, 'expected one lint result')
assert.ok(result.output, 'expected fix-dry-run output (rule must propose a fix)')
assert.ok(
  result.output.includes('/*'),
  'fixed output should contain a block comment from converted line comment',
)
assert.ok(
  !result.output.includes("// 'bar'"),
  'fixed output should not leave // inside the collapsed :class (would break one-line merge)',
)
const classAttr = result.output.match(/:class="[^"]*"/)
assert.ok(classAttr, 'expected :class attribute in fixed output')
assert.ok(
  /\/\*/.test(classAttr[0]) && /\*\//.test(classAttr[0]),
  'fixed :class should contain block comment delimiters inside one attribute',
)

console.log('vue-start-tag-line-comment.test.cjs: OK')
