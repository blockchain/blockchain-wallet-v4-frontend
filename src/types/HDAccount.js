import { Map, List, fromJS as iFromJS } from 'immutable-ext'
import { view, pipe, over, curry, compose, not, is } from 'ramda'
import Type from './Type'
import { JSToI } from './util'
// import * as AddressLabel from './AddressLabel'
import * as AddressLabelMap from './AddressLabelMap'
import * as Cache from './Cache'

/* HDAccount :: {
  label :: String
  ...
} */

const DEFAULT_LABEL = 'My Bitcoin Wallet'

export class HDAccount extends Type {}

export const label = HDAccount.define('label')
export const archived = HDAccount.define('archived')
export const xpriv = HDAccount.define('xpriv')
export const xpub = HDAccount.define('xpub')
export const addressLabels = HDAccount.define('address_labels')
export const cache = HDAccount.define('cache')

export const selectLabel = view(label)
export const selectCache = view(cache)
export const selectArchived = view(archived)
export const selectXpriv = view(xpriv)
export const selectXpub = view(xpub)
export const selectAddressLabels = view(addressLabels)

export const isArchived = compose(Boolean, view(archived))
export const isActive = compose(not, isArchived)

export const fromJS = (x) => {
  if (is(HDAccount, x)) { return x }
  const accountCons = compose(
    over(addressLabels, AddressLabelMap.fromJS),
    over(cache, Cache.fromJS)
  )
  return accountCons(new HDAccount(x))
}

export const toJS = pipe(HDAccount.guard, (acc) => {
  const accountDecons = compose(
    over(addressLabels, AddressLabelMap.toJS),
    over(cache, Cache.toJS)
  )
  return accountDecons(acc).toJS()
})

// export const reviver = (x) => {
//   // const JSONToLabels = R.over(R.lensProp('address_labels'), List)
//   // const JSONtoCache = R.over(R.lensProp('cache'), Map)
//   // const t = R.compose(JSONToLabels, JSONtoCache)
//   // return new HDAccount(t(x))
//   return new HDAccount(JSToI(x))
// }

// TODO :: maybe define address_labels and cache as it is own type
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
