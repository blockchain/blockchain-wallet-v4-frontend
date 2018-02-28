import { mergeAll } from 'ramda'

let types = {
  m: 'margin',
  p: 'padding'
}

let templates = {
  a: (type, size) => ({ [type]: size }),
  h: (type, size) => ({ [type]: `0px ${size}px` }),
  v: (type, size) => ({ [type]: `${size}px 0px` }),
  t: (type, size) => ({ [`${type}Top`]: size }),
  r: (type, size) => ({ [`${type}Right`]: size }),
  b: (type, size) => ({ [`${type}Bottom`]: size }),
  l: (type, size) => ({ [`${type}Left`]: size })
}

export const spacing = (value) => mergeAll(
  value.split(' ').map(statement => {
    let [rule, size] = statement.split('-')
    let [type, tmpl] = rule.split('')
    let valid = types[type] && templates[tmpl] && size % 5 === 0
    return valid ? templates[tmpl](types[type], parseInt(size)) : {}
  })
)
