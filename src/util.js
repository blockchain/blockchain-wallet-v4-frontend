import { Map, List } from 'immutable-ext'
import { is, curry, compose, prop, lens, map, has } from 'ramda'

// export const hasInternal = has('__internal')

// export const error = (e) => { throw e }

// export const typeError = (T, val) => new TypeError(
//   'Expected ' + T.name + ' but received ' +
//   (val == null ? val : val.constructor.name + ': ' + val)
// )

// export const typeGuard = curry((Type, x) =>
//   is(Type, x) ? x : error(typeError(Type, x))
// )

// export const typeLens = (Type) => lens(
//   compose(prop('__internal'), typeGuard(Type)),
//   (val) => new Type(val)
// )

export const iRename = curry((from, to, i) => i.set(to, i.get(from)).delete(from))

export const shift = (x) => ({
  forward: () => x,
  back: () => x
})

export const shiftIProp = curry((from, to, s) => ({
  forward: () => iRename(from, to, s.forward()),
  back: () => iRename(to, from, s.back())
}))

export const iToJS = (i) => i.toJS()

// export const toMapOrList = (x) => {
//   if (Array.isArray(x)) {
//     return List(x)
//   } else if ((typeof x === 'object') && (x !== null) && (!Array.isArray(x))) {
//     return Map(x)
//   } else {
//     return x
//   }
// }

// export const JSToI = object => {
//   const f = (value) => {
//     if (hasInternal(value)) {
//       return value
//     } else {
//       return toMapOrList(value)
//     }
//   }
//   return map(f, object)
// }
///////////////////////////////////////////////////////

export const error = (e) => { throw e }

export const typeError = (T, val) => new TypeError(
  'Expected ' + T.name + ' but received ' +
  (val == null ? val : val.constructor.name + ': ' + val)
)

export const typeGuard = curry((Type, x) =>
  is(Type, x) ? x : error(typeError(Type, x))
)

// console.log(is(Collection, magic))

export const typeLens = (Type) => lens(
  typeGuard(Type),
  (val) => new Type(val)
)
