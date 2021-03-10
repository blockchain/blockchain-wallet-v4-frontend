import Bitcoin from 'bitcoinjs-lib'
import Task from 'data.task'
// eslint-disable-next-line
import { fromJS as iFromJS } from 'immutable-ext'
import {
  assoc,
  compose,
  curry,
  dissoc,
  equals,
  is,
  isEmpty,
  isNil,
  not,
  pipe,
  split,
  values
} from 'ramda'
import { over, traverseOf, view } from 'ramda-lens'

import * as crypto from '../walletCrypto'
/* eslint-disable */
import * as AddressLabelMap from './AddressLabelMap' // if we delete this import, wallet tests will fail -  ¯\_(ツ)_/¯
import * as Cache from './Cache'
import Type from './Type'
/* eslint-enable */

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
export const isXpub = curry((myxpub, account) =>
  compose(equals(myxpub), view(xpub))(account)
)

export const getAddress = (account, path, network) => {
  const [, chain, index] = split('/', path)
  const i = parseInt(index)
  const c = parseInt(chain)
  const derive = acc => Cache.getAddress(selectCache(acc), c, i, network)
  return pipe(HDAccount.guard, derive)(account)
}

export const getReceiveAddress = (account, receiveIndex, network) => {
  HDAccount.guard(account)
  return Cache.getAddress(selectCache(account), 0, receiveIndex, network)
}

export const getChangeAddress = (account, changeIndex, network) => {
  HDAccount.guard(account)
  return Cache.getAddress(selectCache(account), 1, changeIndex, network)
}

export const fromJS = (x, i) => {
  if (is(HDAccount, x)) {
    return x
  }
  const accountCons = a => {
    const xpub = selectXpub(a)
    const node =
      isEmpty(xpub) || isNil(xpub)
        ? null
        : Bitcoin.HDNode.fromBase58(xpub, values(Bitcoin.networks))
    const cacheCons = c =>
      c || isNil(node) ? Cache.fromJS(c) : Cache.fromJS(Cache.js(node))
    return compose(
      over(addressLabels, AddressLabelMap.fromJS),
      over(cache, cacheCons)
    )(a)
  }
  return accountCons(new HDAccount(assoc('index', i, x)))
}

export const toJSwithIndex = pipe(HDAccount.guard, acc => {
  const accountDecons = compose(
    over(addressLabels, AddressLabelMap.toJS),
    over(cache, Cache.toJS)
  )
  return accountDecons(acc).toJS()
})

export const toJS = compose(dissoc('index'), toJSwithIndex)

export const reviver = jsObject => {
  return new HDAccount(jsObject)
}

export const js = (label, node, xpub) => ({
  label: label,
  archived: false,
  xpriv: node ? node.toBase58() : '',
  xpub: node ? node.neutered().toBase58() : xpub,
  address_labels: [],
  cache: node ? Cache.js(node, null) : Cache.js(null, xpub)
})

// encrypt :: Number -> String -> String -> Account -> Task Error Account
export const encrypt = curry((iterations, sharedKey, password, account) => {
  const cipher = crypto.encryptSecPass(sharedKey, iterations, password)
  return traverseOf(xpriv, Task.of, cipher, account)
})

// decrypt :: Number -> String -> String -> Account -> Task Error Account
export const decrypt = curry((iterations, sharedKey, password, account) => {
  const cipher = crypto.decryptSecPass(sharedKey, iterations, password)
  return traverseOf(xpriv, Task.of, cipher, account)
})
