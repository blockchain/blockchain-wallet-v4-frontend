import { is, curry } from 'ramda'

export const error = (e) => { throw e }

const typeError = (T, val) => (
  'Expected ' + T.name + ' but received ' +
  (val == null ? val : val.constructor.name + ': ' + val)
)

export const typeGuard = (Type, f) => curry((a, x) =>
  is(Type, x) ? f(a, x) : error(new TypeError(typeError(Type, x))))

export const iRename = (from, to, i) => i.set(to, i.get(from)).delete(from)

export const iToJS = (i) => i.toJS()
