import styled from 'styled-components'

let types = {
  m: 'margin',
  p: 'padding'
}

let directions = {
  a: (type, size) => `${type}: ${size}px;`,
  h: (type, size) => `${type}: 0px ${size}px;`,
  v: (type, size) => `${type}: ${size}px 0px;`,
  t: (type, size) => `${type}-top: ${size}px;`,
  r: (type, size) => `${type}-right: ${size}px;`,
  b: (type, size) => `${type}-bottom: ${size}px;`,
  l: (type, size) => `${type}-left: ${size}px;`
}

let parseSpacingAttr = (spacing) => {
  return spacing.split(' ').map(statement => {
    let [rule, size] = statement.split('-')
    let [type, direction] = rule.split('')
    let valid = types[type] && directions[direction] && size % 5 === 0
    return valid ? directions[direction](types[type], size) : ''
  }).join(' ')
}

const Spacing = styled.div`
  ${props => typeof props.spacing === 'string' && parseSpacingAttr(props.spacing)}
`

export default Spacing
