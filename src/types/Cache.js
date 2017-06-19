import { view, is, pipe } from 'ramda'
import Type from './Type'
import { iToJS } from './util'

/* AddressLabel :: {
  index :: Number
  label :: String
} */

export class Cache extends Type {}

export const receiveAccount = Cache.define('receiveAccount')
export const changeAccount = Cache.define('changeAccount')

export const selectIndex = view(receiveAccount)
export const selectLabel = view(changeAccount)

export const fromJS = (x) => is(Cache, x) ? x : new Cache(x)

export const toJS = pipe(Cache.guard, iToJS)

// export const reviver = (jsObject) => {
//   return new Cache(jsObject)
// }
