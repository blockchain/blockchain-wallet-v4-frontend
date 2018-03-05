import { is, curry, identity, reduceRight, compose } from 'ramda'
import { lens } from 'ramda-lens'

export const iRename = curry((from, to, i) => i.set(to, i.get(from)).delete(from))

export const iLensProp = (key) => lens(
  (x) => x.get(key),
  (val, x) => x.set(key, val)
)

export const iLensPath = reduceRight(
  (key, lens) => compose(iLensProp(key), lens),
  identity
)

export const shift = (x) => ({
  forward: () => x,
  back: () => x
})

export const shiftIProp = curry((from, to, s) => ({
  forward: () => iRename(from, to, s.forward()),
  back: () => iRename(to, from, s.back())
}))

export const iToJS = (i) => i.toJS()

export const error = (e) => { throw e }

export const typeError = (T, val) => new TypeError(
  'Expected ' + T.name + ' but received ' +
  (val == null ? val : val.constructor.name + ': ' + val)
)

export const typeGuard = curry((Type, x) =>
  is(Type, x) ? x : error(typeError(Type, x))
)

export const typeLens = (Type) => lens(
  typeGuard(Type),
  (val) => new Type(val)
)
