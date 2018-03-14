import { is, curry, identity, reduceRight, compose, prop, assoc, ifElse, lens } from 'ramda'
import { Map } from 'immutable'
import * as Task from 'data.task'

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

export const taskMap = curry((fun, task) => {
  return task.map(obj => {
    console.debug('MAP ', obj)
    return fun(obj)
  })
})
export const taskChain = curry((fun, task) => {
  return task.chain(obj => {
    console.debug('CHAIN ', obj)
    return fun(obj)
  })
})

export const whenTask = curry((con, c) => ifElse(con, c, Task.of))

export const lensProp = key =>
  lens(
    (x) => {
      console.debug('GET ', key, ' from ', x)
      if (Map.isMap(x)) {
        return x.get(key)
      } else {
        return prop(key, x)
      }
    },
    (val, x) => {
      console.debug('SET ', key, ' TO ', val, ' in ', x)
      if (Map.isMap(x)) {
        return x.set(key, val)
      } else {
        return assoc(key, val, x)
      }
    }
)

export const log = (a) => {
  console.info('LOG: ', a)
  return a
}

export const logWithComment = curry((comment, a) => {
  console.info('LOG: ', comment, ' ', a)
  return a
})
