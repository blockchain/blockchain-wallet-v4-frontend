import { fromJS as iFromJS } from 'immutable-ext' // if we delete that wallet test fail - idk why
import { pipe, curry, compose, not, is, equals, assoc, dissoc, isNil, split } from 'ramda'
import { view, over, set } from 'ramda-lens'
import Type from './Type'
import * as AddressLabelMap from './AddressLabelMap'
import * as Cache from './Cache'

/* HDAccount :: {
  label :: String
  ...
} */

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

export const getAddress = (account, path, network) => {
  const [_, chain, index] = split('/', path)
  const i = parseInt(index)
  const c = parseInt(chain)
  const derive = (acc) => Cache.getAddress(selectCache(acc), c, i, network)
  return pipe(HDAccount.guard, derive)(account)
}

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

export const reviver = (jsObject) => {
  return new HDAccount(jsObject)
}

export const js = (label, node, xpub) => ({
  label: label,
  archived: false,
  xpriv: node ? node.toBase58() : '',
  xpub: node ? node.neutered().toBase58() : xpub,
  address_labels: [],
  cache: Cache.js(node)
})
