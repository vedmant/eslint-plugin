'use strict'

/**
 * Ensures @vedmant/vue-start-tag-single-line works:
 * - __tests__/compliant.vue passes ESLint
 * - __tests__/fixtures/should-error-multiline-opening.vue fails until --fix (run manually if needed)
 */
const { execFileSync } = require('child_process')
const path = require('path')

const root = path.resolve(__dirname, '..')
const eslintBin = path.join(root, 'node_modules/eslint/bin/eslint.js')
const configPath = path.join(root, 'eslint.config.cjs')

function runEslint (args) {
  execFileSync(process.execPath, [eslintBin, '-c', configPath, ...args], {
    cwd: root,
    stdio: 'inherit',
    env: process.env,
  })
}

const compliant = path.join(root, '__tests__/compliant.vue')
const fixture = path.join(root, '__tests__/fixtures/should-error-multiline-opening.vue')

runEslint([compliant, '--max-warnings=0'])

let fixtureFailed = false
try {
  runEslint(['--no-ignore', fixture, '--max-warnings=0'])
} catch (e) {
  const code = e.status ?? e.code
  if (code === 1) {
    fixtureFailed = true
  } else {
    throw e
  }
}

if (! fixtureFailed) {
  console.error('Expected ESLint to report errors for should-error-multiline-opening.vue')
  process.exit(1)
}

console.log('verify-vue-start-tag-rule: compliant.vue OK; fixture fails as expected (use eslint --no-ignore --fix on fixture to confirm autofix).')
