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

let flexDirections = {
  row: 'row',
  col: 'column'
}

let flexProperties = {
  align: 'alignItems',
  justify: 'justifyContent'
}

let flexRules = {
  'center': 'center',
  'end': 'flex-end',
  'start': 'flex-start',
  'base': 'baseline',
  'around': 'space-around',
  'between': 'space-between',
  'evenly': 'space-evenly'
}

export const flex = (value) => {
  let [directions, ...params] = value.split(' ')
  let base = {
    display: 'flex',
    flexDirection: flexDirections[directions]
  }
  return mergeAll([base].concat(params.map(p => {
    let [property, rule] = p.split('/')
    return { [flexProperties[property]]: flexRules[rule] }
  })))
}
