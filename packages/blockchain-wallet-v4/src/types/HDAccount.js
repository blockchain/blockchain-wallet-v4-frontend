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
  split
} from 'ramda'
import { view, over, traversed, traverseOf } from 'ramda-lens'
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

// Lens used to traverse all secrets for double encryption
export const secretsLens = compose(
  derivations,
  traversed,
  Derivation.secretsLens
)

export const selectLabel = view(label)
export const selectArchived = view(archived)
export const selectIndex = view(index)
export const selectDerivations = view(derivations)

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

export const selectXpub = (account, type = 'segwitP2SH') => {
  const derivations = selectDerivations(account)
  // TODO: SEGWIT FIX ME type is being passed as a number from balance selectors (something todo with spendable context)
  const derivation = DerivationList.getDerivationFromType(
    derivations,
    typeof type === 'string' ? type : 'segwitP2SH'
  )
  return Derivation.selectXpub(derivation)
}

export const selectXpriv = (account, type = 'segwitP2SH') => {
  const derivations = selectDerivations(account)
  const derivation = DerivationList.getDerivationFromType(derivations, type)
  return Derivation.selectXpriv(derivation)
}

export const selectAddressLabels = (account, type = 'segwitP2SH') => {
  const derivations = selectDerivations(account)
  const derivation = DerivationList.getDerivationFromType(derivations, type)
  return Derivation.selectAddressLabels(derivation)
}

export const getAddress = (account, path, network, type = 'segwitP2SH') => {
  const [, chain, index] = split('/', path)
  const i = parseInt(index)
  const c = parseInt(chain)
  const derivations = selectDerivations(account)
  const cache = DerivationList.getCacheFromType(derivations, type)
  return Cache.getAddress(cache, c, i, network, type)
}

export const getReceiveAddress = (
  account,
  receiveIndex,
  network,
  type = 'segwitP2SH'
) => {
  HDAccount.guard(account)
  const derivations = selectDerivations(account)
  const cache = DerivationList.getCacheFromType(derivations, type)
  return Cache.getAddress(cache, 0, receiveIndex, network, type)
}

export const getChangeAddress = (
  account,
  changeIndex,
  network,
  type = 'segwitP2SH'
) => {
  HDAccount.guard(account)
  const derivations = selectDerivations(account)
  const cache = DerivationList.getCacheFromType(derivations, type)

  return Cache.getAddress(cache, 1, changeIndex, network, type)
}

// migrateFromV3 :: Object -> Object
// TODO: SEGWIT i think we should still derive legacy account even though it probably will never be used
// TODO: SEGWIT if we dont, we need to add checks to various code paths to avoid errors. TBD
const migrateFromV3 = account => {
  if (account.derivations != null) {
    return account
  }

  const derivation = {
    type: 'legacy',
    purpose: 44,
    xpriv: account.xpriv,
    xpub: account.xpub,
    address_labels: account.address_labels,
    cache: account.cache
  }

  const migrate = compose(
    assoc('derivations', [derivation]),
    dissoc('xpriv'),
    dissoc('xpub'),
    dissoc('address_labels'),
    dissoc('cache')
  )

  return migrate(account)
}

export const fromJS = (account, index) => {
  if (is(HDAccount, account)) {
    return account
  }

  const accountCons = compose(
    over(derivations, DerivationList.fromJS),
    a => new HDAccount(a),
    assoc('index', index),
    migrateFromV3
  )

  return accountCons(account)
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

export const js = (label, derivation) => ({
  label: label,
  archived: false,
  derivations: [derivation]
})

// encrypt :: Number -> String -> String -> Account -> Task Error Account
export const encrypt = curry((iterations, sharedKey, password, account) => {
  const cipher = crypto.encryptSecPass(sharedKey, iterations, password)
  return traverseOf(secretsLens, Task.of, cipher, account)
})

// decrypt :: Number -> String -> String -> Account -> Task Error Account
export const decrypt = curry((iterations, sharedKey, password, account) => {
  const cipher = crypto.decryptSecPass(sharedKey, iterations, password)
  return traverseOf(secretsLens, Task.of, cipher, account)
})
