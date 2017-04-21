import { is, curry, compose, prop, lens } from 'ramda'

export const error = (e) => { throw e }

export const typeError = (T, val) => new TypeError(
  'Expected ' + T.name + ' but received ' +
  (val == null ? val : val.constructor.name + ': ' + val)
)

export const typeGuard = curry((Type, x) =>
  is(Type, x) ? x : error(typeError(Type, x))
)

export const typeLens = (Type) => lens(
  compose(prop('__internal'), typeGuard(Type)),
  (val) => new Type(val)
)

export const iRename = (from, to, i) => i.set(to, i.get(from)).delete(from)

export const iToJS = (i) => i.toJS()
