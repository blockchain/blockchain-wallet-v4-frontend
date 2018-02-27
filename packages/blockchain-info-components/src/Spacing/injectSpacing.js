import { injectGlobal } from 'styled-components'

let sizes = [5, 10, 15, 20, 25, 30]

let types = { m: 'margin', p: 'padding' }

let directions = {
  a: (type, size) => `${type}: ${size}px;`,
  h: (type, size) => `${type}: 0px ${size}px;`,
  v: (type, size) => `${type}: ${size}px 0px;`,
  t: (type, size) => `${type}-top: ${size}px;`,
  r: (type, size) => `${type}-right: ${size}px;`,
  b: (type, size) => `${type}-bottom: ${size}px;`,
  l: (type, size) => `${type}-left: ${size}px;`
}

const injectSpacing = () => {
  let createClass = (type, direction, size) => [
    `.${type + direction}-${size} {`,
      `${directions[direction](types[type], size)}`,
    '}'
  ].join(' ')

  let createStylesheet = () => (
    Object.keys(types).map(t =>
      Object.keys(directions).map(d =>
        sizes.map(s => createClass(t, d, s)).join('\n')
      ).join('\n')
    ).join('\n')
  )

  injectGlobal`${createStylesheet()}`
}

export default injectSpacing
