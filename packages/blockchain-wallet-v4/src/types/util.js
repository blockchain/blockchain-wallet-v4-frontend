import { Map } from 'immutable'
import { assoc, compose, curry, identity, is, prop, reduceRight } from 'ramda'
import { lens } from 'ramda-lens'

export const iRename = curry((from, to, i) => i.set(to, i.get(from)).delete(from))

export const iLensProp = (key) =>
  lens(
    (x) => x.get(key),
    (val, x) => x.set(key, val)
  )

export const iLensPath = reduceRight((key, lens) => compose(iLensProp(key), lens), identity)

export const shift = (x) => ({
  back: () => x,
  forward: () => x
})

export const shiftIProp = curry((from, to, s) => ({
  back: () => iRename(to, from, s.back()),
  forward: () => iRename(from, to, s.forward())
}))

export const iToJS = (i) => i.toJS()

export const error = (e) => {
  throw e
}

export const typeError = (T, val) =>
  new TypeError(
    `Expected ${T.name} but received ${val == null ? val : `${val.constructor.name}: ${val}`}`
  )

export const typeGuard = curry((Type, x) => (is(Type, x) ? x : error(typeError(Type, x))))

export const typeLens = (Type) => lens(typeGuard(Type), (val) => new Type(val))

export const lensProp = (key) =>
  lens(
    (x) => {
      // console.info('GET ', key, ' from ', x)
      if (Map.isMap(x)) {
        return x.get(key)
      }
      return prop(key, x)
    },
    (val, x) => {
      // console.info('SET ', key, ' TO ', val, ' in ', x)
      if (Map.isMap(x)) {
        return x.set(key, val)
      }
      return assoc(key, val, x)
    }
  )
