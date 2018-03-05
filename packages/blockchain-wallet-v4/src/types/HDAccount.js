import Bitcoin from 'bitcoinjs-lib'
import { pipe, curry, compose, not, is, equals, assoc, dissoc, isNil, split, isEmpty } from 'ramda'
import { view, over, traverseOf } from 'ramda-lens'
import * as crypto from '../walletCrypto'
import Either from 'data.either'
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
  const [, chain, index] = split('/', path)
  const i = parseInt(index)
  const c = parseInt(chain)
  const derive = (acc) => Cache.getAddress(selectCache(acc), c, i, network)
  return pipe(HDAccount.guard, derive)(account)
}

export const getReceiveAddress = (account, receiveIndex, network) => {
  HDAccount.guard(account)
  return Cache.getAddress(selectCache(account), 0, receiveIndex, network)
}

export const fromJS = (x, i) => {
  if (is(HDAccount, x)) { return x }
  const accountCons = a => {
    const xpub = selectXpub(a)
    const node = isEmpty(xpub) || isNil(xpub) ? null : Bitcoin.HDNode.fromBase58(xpub) // TODO :: network
    const cacheCons = (c) => c || isNil(node) ? Cache.fromJS(c) : Cache.fromJS(Cache.js(node))
    return compose(
      over(addressLabels, AddressLabelMap.fromJS),
      over(cache, cacheCons)
    )(a)
  }
  return accountCons(new HDAccount(assoc('index', i, x)))
}

export const toJSwithIndex = pipe(HDAccount.guard, (acc) => {
  const accountDecons = compose(
    over(addressLabels, AddressLabelMap.toJS),
    over(cache, Cache.toJS)
  )
  return accountDecons(acc).toJS()
})

export const toJS = compose(dissoc('index'), toJSwithIndex)

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

// encryptSync :: Number -> String -> String -> Account -> Either Error Account
export const encryptSync = curry((iterations, sharedKey, password, account) => {
  const cipher = crypto.encryptSecPassSync(sharedKey, iterations, password)
  return traverseOf(xpriv, Either.of, cipher, account)
})

// decryptSync :: Number -> String -> String -> Account -> Either Error Account
export const decryptSync = curry((iterations, sharedKey, password, account) => {
  const cipher = crypto.decryptSecPassSync(sharedKey, iterations, password)
  return traverseOf(xpriv, Either.of, cipher, account)
})
