// import * as R from 'ramda'
// import Type from './Type'

// /* AddressLabel :: {
//   index :: Number
//   label :: String
// } */

// export class Cache extends Type {}

// export const receiveAccount = Cache.define('receiveAccount')
// export const changeAccount = Cache.define('changeAccount')

// export const selectIndex = R.view(receiveAccount)
// export const selectLabel = R.view(changeAccount)

// export const fromJS = (x) => {
//   if (x instanceof Cache) { return x }
//   return new Cache(x)
// }

// export const toJS = R.pipe(Cache.guard, (cache) => {
//   return cache.__internal.toJS()
// })

// export const toJSON = R.pipe(Cache.guard, (cache) => {
//   return cache.__internal.toJS()
// })

// export const fromJSON = (jsObject) => {
//   return new Cache(jsObject)
// }
