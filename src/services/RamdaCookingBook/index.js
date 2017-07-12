import { curry, reduce, assoc, keys } from 'ramda'

export const renameKeys = curry((keysMap, obj) => reduce((acc, key) => assoc(keysMap[key] || key, obj[key], acc), {}, keys(obj)))

export const assign = (state, next) => Object.assign({}, state, next)
