/**
 * Prefer one-line opening tags when attribute count ≤ maxAttributes and the line fits maxLineLength.
 * Auto-fix collapses whitespace/newlines between attributes (multiline attribute values are normalized to single-line spacing).
 */
'use strict'

const utils = {
  defineTemplateBodyVisitor (context, templateBodyVisitor, scriptVisitor) {
    // ESLint v9 flat config exposes parserServices on sourceCode; v8 exposes it on context directly.
    const services = context.sourceCode?.parserServices ?? context.parserServices
    if (services && services.defineTemplateBodyVisitor) {
      return services.defineTemplateBodyVisitor(templateBodyVisitor, scriptVisitor || {})
    }
    return scriptVisitor || {}
  },
}

/** Backtick — use `\u0060` so `'`/`'` pairs are not parsed as an empty string. */
const BT = '\u0060'

/**
 * Collapsing an opening tag joins lines with spaces; a `//` comment then swallows the rest of the
 * merged line. Convert `//…` line comments to block comments (`/* … *\/`) when not inside strings or existing block comments.
 * @param {string} text
 * @returns {string}
 */
function lineCommentsToBlockForCompact (text) {
  let out = ''
  let i = 0
  const len = text.length
  let quote = null
  let escape = false
  let blockDepth = 0

  while (i < len) {
    const c = text[i]

    if (blockDepth > 0) {
      out += c
      if (c === '/' && text[i + 1] === '*') {
        blockDepth++
        out += '*'
        i += 2
        continue
      }
      if (c === '*' && text[i + 1] === '/') {
        blockDepth--
        out += '/'
        i += 2
        continue
      }
      i++
      continue
    }

    if (quote) {
      out += c
      if (quote === BT) {
        if (escape) {
          escape = false
        } else if (c === '\\') {
          escape = true
        } else if (c === BT) {
          quote = null
        }
      } else if (escape) {
        escape = false
      } else if (c === '\\') {
        escape = true
      } else if (c === quote) {
        quote = null
      }
      i++
      continue
    }

    if (c === '/' && text[i + 1] === '*') {
      blockDepth = 1
      out += '/*'
      i += 2
      continue
    }

    if (c === '/' && text[i + 1] === '/') {
      let j = i + 2
      while (j < len && text[j] !== '\n' && text[j] !== '\r') {
        j++
      }
      const body = text.slice(i + 2, j)
      out += `/*${body} */`
      i = j
      if (i < len && text[i] === '\r') {
        out += '\r'
        i++
      }
      if (i < len && text[i] === '\n') {
        out += '\n'
        i++
      }
      continue
    }

    if (c === '"' || c === '\'' || c === BT) {
      quote = c
      out += c
      i++
      continue
    }

    out += c
    i++
  }

  return out
}

/**
 * Attribute source from the template is `name="expression"` (or single quotes). The outer quotes
 * wrap a JS expression; `//` inside `{ … }` must be converted before collapsing lines. Strip those
 * outer quotes, transform `//` in the inner text only, then reassemble.
 * @param {string} raw
 * @returns {string}
 */
function compactAttributeSource (raw) {
  const eq = raw.indexOf('=')
  if (eq < 0) {
    return lineCommentsToBlockForCompact(raw).replace(/\s+/g, ' ').trim()
  }

  let i = eq + 1
  while (i < raw.length && /\s/.test(raw[i])) {
    i++
  }

  const open = raw[i]
  if (open !== '"' && open !== '\'') {
    return lineCommentsToBlockForCompact(raw).replace(/\s+/g, ' ').trim()
  }

  if (raw.length < i + 2 || raw[raw.length - 1] !== open) {
    return lineCommentsToBlockForCompact(raw).replace(/\s+/g, ' ').trim()
  }

  const prefix = raw.slice(0, i)
  const inner = raw.slice(i + 1, -1)
  const innerDone = lineCommentsToBlockForCompact(inner)

  return (prefix + open + innerDone + open).replace(/\s+/g, ' ').trim()
}

/**
 * @param {import('eslint').SourceCode} sourceCode
 * @param {object} startTagNode VStartTag AST node
 */
function buildCompactStartTag (sourceCode, startTagNode) {
  const el = startTagNode.parent
  if (! el || el.type !== 'VElement') { return null }

  const parts = ['<', el.rawName]

  for (const attr of startTagNode.attributes) {
    parts.push(' ')
    parts.push(compactAttributeSource(sourceCode.getText(attr)))
  }

  if (startTagNode.selfClosing) {
    parts.push(' />')
  } else {
    parts.push('>')
  }

  return parts.join('')
}

module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description: 'Prefer single-line Vue template opening tags when attribute count and line length allow.',
    },
    fixable: 'whitespace',
    schema: [{
      type: 'object',
      properties: {
        maxAttributes: { type: 'integer', minimum: 0, default: 5 },
        maxLineLength: { type: 'integer', minimum: 1, default: 300 },
      },
      additionalProperties: false,
    }],
    messages: {
      preferSingleLine:
        'Put this opening tag on one line ({{count}} attribute(s); compact length {{length}} must be ≤ {{maxLine}}).',
    },
  },

  /** @param {import('eslint').Rule.RuleContext} context */
  create (context) {
    const opts = context.options[0] || {}
    const maxAttributes = opts.maxAttributes ?? 5
    const maxLineLength = opts.maxLineLength ?? 300
    const sourceCode = context.sourceCode

    return utils.defineTemplateBodyVisitor(context, {
      VStartTag (node) {
        if (node.loc.start.line === node.loc.end.line) { return }

        const attrCount = node.attributes.length
        if (attrCount > maxAttributes) { return }

        const compact = buildCompactStartTag(sourceCode, node)
        if (! compact || compact.length > maxLineLength) { return }

        context.report({
          node,
          messageId: 'preferSingleLine',
          data: {
            count: attrCount,
            length: compact.length,
            maxLine: maxLineLength,
          },
          fix (fixer) {
            return fixer.replaceTextRange(node.range, compact)
          },
        })
      },
    })
  },
}
