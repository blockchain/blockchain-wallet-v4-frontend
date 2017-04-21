import { is, curry, compose, prop, lens, view } from 'ramda'
import { iLensProp } from './lens'

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

export const typeDef = (Type) => {
  let lens = typeLens(Type)
  let guard = typeGuard(Type)
  let defineProp = (prop) => compose(lens, iLensProp(prop))

  let define = (prop) => {
    let propLens = defineProp(prop)
    Object.defineProperty(Type.prototype, prop, {
      configurable: false,
      enumerable: true,
      get () { return view(propLens, this) }
    })
    return propLens
  }

  return { lens, guard, define }
}

export const iRename = (from, to, i) => i.set(to, i.get(from)).delete(from)

export const iToJS = (i) => i.toJS()
