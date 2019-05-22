import {
  pipe,
  curry,
  compose,
  not,
  is,
  equals,
  assoc,
  dissoc,
  isNil,
  set,
  split
} from 'ramda'
import { view, over, traverseOf } from 'ramda-lens'
import * as crypto from '../walletCrypto'
import Task from 'data.task'
import Type from './Type'
import * as DerivationList from './DerivationList'
import * as Derivation from './Derivation'
import * as Cache from './Cache'
/* eslint-disable */
import { fromJS as iFromJS } from 'immutable-ext' // if we delete this import, wallet tests will fail -  ¯\_(ツ)_/¯
/* eslint-enable */

/* HDAccount :: {
  label :: String
  ...
} */

export class HDAccount extends Type {}
export const isHDAccount = is(HDAccount)
export const label = HDAccount.define('label')
export const archived = HDAccount.define('archived')
export const index = HDAccount.define('index')
export const derivations = HDAccount.define('derivations')
export const xpriv = HDAccount.define('xpriv')
export const addressLabels = HDAccount.define('address_labels')
export const cache = HDAccount.define('cache')
// export const xpub = HDAccount.define('xpub')
export const selectLabel = view(label)
export const selectArchived = view(archived)
export const selectIndex = view(index)
export const selectDerivations = view(derivations)
export const selectCache = view(cache)
// export const selectXpriv = view(xpriv)
// export const selectXpub = view(xpub)
// export const selectAddressLabels = view(addressLabels)

export const isArchived = compose(
  Boolean,
  view(archived)
)
export const isActive = compose(
  not,
  isArchived
)
export const isWatchOnly = account =>
  compose(
    isNil,
    selectXpriv
  )(account)

export const isXpub = curry((myxpub, account) =>
  compose(
    equals(myxpub),
    selectXpub
  )(account)
)
// TODO: SEGWIT (get all xpubs)
// TODO: SEGWIT (get xpub for derivation)
export const selectXpub = account => {
  const derivations = selectDerivations(account)
  const derivation = DerivationList.getDerivationFromType(derivations, 'legacy')
  return Derivation.selectXpub(derivation)
}
// TODO: SEGWIT (get xpriv for derivation)
export const selectXpriv = account => {
  const derivations = selectDerivations(account)
  const derivation = DerivationList.getDerivationFromType(derivations, 'legacy')
  return Derivation.selectXpriv(derivation)
}
// TODO: SEGWIT (get address labels for derivation)
export const selectAddressLabels = account => {
  const derivations = selectDerivations(account)
  const derivation = DerivationList.getDerivationFromType(derivations, 'legacy')
  return Derivation.selectAddressLabels(derivation)
}

export const getAddress = (account, path, network, type = 'legacy') => {
  const [, chain, index] = split('/', path)
  const i = parseInt(index)
  const c = parseInt(chain)
  const derivations = selectDerivations(account)
  const cache = DerivationList.getCacheFromType(derivations, type)
  return Cache.getAddress(cache, c, i, network)
}

export const upgradeToV4 = pipe(
  HDAccount.guard,
  account => {
    const derivation = Derivation.createNew({
      type: 'legacy',
      purpose: 44,
      xpriv: selectXpriv(account),
      xpub: selectXpub(account),
      addressLabels: selectAddressLabels(account),
      cache: selectCache(account)
    })

    const upgrade = compose(
      set(derivations, DerivationList.createNew([derivation])),
      HDAccount.fromJS,
      dissoc('xpriv'),
      dissoc('xpub'),
      dissoc('address_labels'),
      dissoc('cache'),
      HDAccount.toJS
    )

    return upgrade(account)
  }
)

export const getReceiveAddress = (
  account,
  receiveIndex,
  network,
  type = 'legacy'
) => {
  HDAccount.guard(account)
  const derivations = selectDerivations(account)
  const cache = DerivationList.getCacheFromType(derivations, type)

  return Cache.getAddress(cache, 0, receiveIndex, network)
}

export const getChangeAddress = (
  account,
  changeIndex,
  network,
  type = 'legacy'
) => {
  HDAccount.guard(account)
  const derivations = selectDerivations(account)
  const cache = DerivationList.getCacheFromType(derivations, type)

  return Cache.getAddress(cache, 1, changeIndex, network)
}

export const fromJS = (x, i) => {
  if (is(HDAccount, x)) {
    return x
  }
  const accountCons = a => {
    return over(derivations, DerivationList.fromJS, a)
  }
  return accountCons(new HDAccount(assoc('index', i, x)))
}

export const toJSwithIndex = pipe(
  HDAccount.guard,
  acc => {
    const accountDecons = compose(over(derivations, DerivationList.toJS))
    return accountDecons(acc).toJS()
  }
)

export const toJS = compose(
  dissoc('index'),
  toJSwithIndex
)

export const reviver = jsObject => {
  return new HDAccount(jsObject)
}

export const js = (label, node, xpub) => ({
  label: label,
  archived: false,
  derivations: DerivationList.createNew([
    Derivation.createNew({
      xpriv: node ? node.toBase58() : '',
      xpub: node ? node.neutered().toBase58() : xpub,
      address_labels: [],
      cache: node ? Cache.js(node, null) : Cache.js(null, xpub)
    })
  ])
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
