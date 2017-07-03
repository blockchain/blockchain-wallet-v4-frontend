import { fromJS as iFromJS } from 'immutable-ext' // if we delete that wallet test fail - idk why
import { view, pipe, over, curry, compose, not, is, equals, assoc, dissoc, isNil, set } from 'ramda'
import Type from './Type'
import { JSToI, iLensProp } from './util'
import * as AddressLabelMap from './AddressLabelMap'
import * as AddressLabel from './AddressLabel'
import * as Cache from './Cache'

/* HDAccount :: {
  label :: String
  ...
} */

const DEFAULT_LABEL = 'My Bitcoin Wallet'

export class HDAccount extends Type {}

export const isHDAccount = is(HDAccount)

export const label = HDAccount.define('label')
export const archived = HDAccount.define('archived')
export const xpriv = HDAccount.define('xpriv')
export const xpub = HDAccount.define('xpub')
export const addressLabels = HDAccount.define('address_labels')
export const cache = HDAccount.define('cache')
export const index = HDAccount.define('index')

export const selectLabel = view(label)
export const selectCache = view(cache)
export const selectArchived = view(archived)
export const selectXpriv = view(xpriv)
export const selectXpub = view(xpub)
export const selectAddressLabels = view(addressLabels)
export const selectIndex = view(index)

export const isArchived = compose(Boolean, view(archived))
export const isActive = compose(not, isArchived)
export const isWatchOnly = compose(isNil, view(xpriv))

export const isXpub = curry((myxpub, account) => compose(equals(myxpub), view(xpub))(account))

export const fromJS = (x, i) => {
  if (is(HDAccount, x)) { return x }
  const accountCons = compose(
    over(addressLabels, AddressLabelMap.fromJS),
    over(cache, Cache.fromJS)
  )
  return accountCons(new HDAccount(assoc('index', i, x)))
}

export const toJS = pipe(HDAccount.guard, (acc) => {
  const accountDecons = compose(
    over(addressLabels, AddressLabelMap.toJS),
    over(cache, Cache.toJS)
  )
  return dissoc('index', accountDecons(acc).toJS())
})

export const setAddressLabel = curry((index, label, hdAccount) => {
  let addressLabel = AddressLabel.fromJS({ index, label })
  let addressLabelLens = compose(addressLabels, iLensProp(index.toString()))
  return set(addressLabelLens, addressLabel, hdAccount)
})

export const removeAddressLabel = curry((index, hdAccount) => {
  return over(addressLabels, (l) => l.remove(index.toString()), hdAccount)
})

export const reviver = (jsObject) => {
  return new HDAccount(jsObject)
}

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
