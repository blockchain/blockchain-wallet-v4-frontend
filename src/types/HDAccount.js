// import { Map, List, fromJS as iFromJS } from 'immutable-ext'
// import * as R from 'ramda'
// import Type from './Type'
// import { JSToI } from '../util'
// import * as AddressLabel from './AddressLabel'
// import * as Cache from './Cache'

// /* HDAccount :: {
//   label :: String
//   ...
// } */

// const DEFAULT_LABEL = 'My Bitcoin Wallet'

// export class HDAccount extends Type {}

// export const label = HDAccount.define('label')
// export const archived = HDAccount.define('archived')
// export const xpriv = HDAccount.define('xpriv')
// export const xpub = HDAccount.define('xpub')
// export const addressLabels = HDAccount.define('address_labels')
// export const cache = HDAccount.define('cache')

// export const selectLabel = R.view(label)
// export const selectCache = R.view(cache)
// export const selectArchived = R.view(archived)
// export const selectXpriv = R.view(xpriv)
// export const selectXpub = R.view(xpub)
// export const selectAddressLabels = R.view(addressLabels)

// export const isArchived = R.compose(Boolean, R.view(archived))
// export const isActive = R.compose(R.not, isArchived)

// export const fromJS = (x) => {
//   if (x instanceof HDAccount) { return x }
//   const AddressLabelsListCons = R.compose(List, R.map(AddressLabel.fromJS))
//   const t = R.compose(
//     R.over(addressLabels, AddressLabelsListCons),
//     R.over(cache, Cache.fromJS)
//   )
//   return t(new HDAccount(iFromJS(x)))
// }

// export const toJS = R.pipe(HDAccount.guard, (acc) => {
//   const iToJS = x => x.toJS()
//   const labelsToJSON = R.over(addressLabels, R.map(AddressLabel.toJS))
//   const cacheToJSON = R.over(cache, Cache.toJS)
//   const t = R.compose(labelsToJSON, cacheToJSON)
//   return iToJS(t(acc).__internal)
// })

// export const fromJSON = (x) => {
//   // const JSONToLabels = R.over(R.lensProp('address_labels'), List)
//   // const JSONtoCache = R.over(R.lensProp('cache'), Map)
//   // const t = R.compose(JSONToLabels, JSONtoCache)
//   // return new HDAccount(t(x))
//   return new HDAccount(JSToI(x))
// }

// export const toJSON = R.pipe(HDAccount.guard, (acc) => acc.__internal.toJS())

// // TODO :: maybe define address_labels and cache as it is own type
// export const createNew = R.curry((accountNode, { label = DEFAULT_LABEL } = {}) => {
//   return fromJS({
//     label,
//     archived: false,
//     xpriv: accountNode.toBase58(),
//     xpub: accountNode.neutered().toBase58(),
//     address_labels: [],
//     cache: {
//       receiveAccount: accountNode.derive(0).neutered().toBase58(),
//       changeAccount: accountNode.derive(1).neutered().toBase58()
//     }
//   })
// })
