import * as Bitcoin from 'bitcoinjs-lib'
import Task from 'data.task'
/* eslint-disable */
import { fromJS as iFromJS } from 'immutable-ext' // if we delete this import, wallet tests will fail -  ¯\_(ツ)_/¯
import { assoc, compose, contains, curry, dissoc, is, isNil, not, pipe, split } from 'ramda'
/* eslint-disable */
import { over, traversed, traverseOf, view } from 'ramda-lens'

import * as crypto from '../walletCrypto'
import * as Cache from './Cache'
import * as Derivation from './Derivation'
import * as DerivationList from './DerivationList'
import Type from './Type'

export const DEFAULT_DERIVATION_TYPE = 'bech32'
export const DEFAULT_DERIVATION_PURPOSE = 84
export const LEGACY_DERIVATION_TYPE = 'legacy'
export const LEGACY_DERIVATION_PURPOSE = 44

export const DERIVATION_LIST = [
  {
    type: DEFAULT_DERIVATION_TYPE,
    purpose: DEFAULT_DERIVATION_PURPOSE
  },
  {
    type: LEGACY_DERIVATION_TYPE,
    purpose: LEGACY_DERIVATION_PURPOSE
  }
]

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
export const defaultDerivation = HDAccount.define('default_derivation')

// Lens used to traverse all secrets for double encryption
export const secretsLens = compose(derivations, traversed, Derivation.secretsLens)

export const selectLabel = view(label)
export const selectArchived = view(archived)
export const selectIndex = view(index)
export const selectDerivations = view(derivations)
export const selectDefaultDerivation = view(defaultDerivation)

export const isArchived = compose(Boolean, view(archived))

export const isActive = compose(not, isArchived)

export const isWatchOnly = (account) =>
  // @ts-ignore
  compose(isNil, selectXpriv('bech32'))(account)

export const isXpub = curry((myxpub, account) => compose(contains(myxpub), selectAllXpubs)(account))

export const selectAllXpubsGrouped = account => {
  const derivations = selectDerivations(account)
  return DerivationList.getXpubsAndTypesFromDerivations(derivations)
}

export const selectAllXpubs = account => {
  const derivations = selectDerivations(account)
  return DerivationList.getXpubsFromDerivations(derivations)
}

export const selectXpub = (account, type?) => {
  const derivationType = type || selectDefaultDerivation(account)
  const derivations = selectDerivations(account)
  const derivation = DerivationList.getDerivationFromType(derivations, derivationType)
  return Derivation.selectXpub(derivation)
}

export const selectXpriv = curry((type, account) => {
  const derivationType = type || selectDefaultDerivation(account)
  const derivations = selectDerivations(account)
  const derivation = DerivationList.getDerivationFromType(derivations, derivationType)
  return Derivation.selectXpriv(derivation)
})

export const selectAddressLabels = (account, type) => {
  const derivationType = type || selectDefaultDerivation(account)
  const derivations = selectDerivations(account)
  const derivation = DerivationList.getDerivationFromType(derivations, derivationType)
  return Derivation.selectAddressLabels(derivation)
}

export const getAddress = (account, path, network, type?) => {
  const [, chain, index] = split('/', path)
  const i = parseInt(index)
  const c = parseInt(chain)
  const derivationType = type || selectDefaultDerivation(account)
  const derivations = selectDerivations(account)
  const derivation = DerivationList.getDerivationFromType(derivations, derivationType)
  const { publicKey } = Bitcoin.bip32.fromBase58(derivation.xpub).derivePath(`${c}/${i}`)

  switch (derivationType) {
    case 'bech32':
      return Bitcoin.payments.p2wpkh({ pubkey: publicKey }).address
    case 'legacy':
      return Bitcoin.payments.p2pkh({ pubkey: publicKey }).address
    default:
      throw new Error(`Unrecogonized derivation type ${derivationType}`)
  }
}

export const getReceiveAddress = (account, receiveIndex, network, type?) => {
  HDAccount.guard(account)
  const derivationType = type || selectDefaultDerivation(account)
  return getAddress(account, `M/0/${receiveIndex}`, network, derivationType)
}

export const getChangeAddress = (account, changeIndex, network, type?) => {
  HDAccount.guard(account)
  const derivationType = type || selectDefaultDerivation(account)
  return getAddress(account, `M/1/${changeIndex}`, network, derivationType)
}

// migrateFromV3 :: Object -> Object
const migrateFromV3 = (account) => {
  if (account.derivations != null) {
    return account
  }

  const derivation = {
    type: LEGACY_DERIVATION_TYPE,
    purpose: LEGACY_DERIVATION_PURPOSE,
    xpriv: account.xpriv,
    xpub: account.xpub,
    address_labels: account.address_labels,
    cache: account.cache
  }

  const migrate = compose(
    assoc('derivations', [derivation]),
    // @ts-ignore
    assoc('default_derivation', DEFAULT_DERIVATION_TYPE),
    dissoc('xpriv'),
    dissoc('xpub'),
    dissoc('address_labels'),
    dissoc('cache')
  )
  // @ts-ignore
  return migrate(account)
}

export const fromJS = (account, index) => {
  if (is(HDAccount, account)) {
    return account
  }

  const accountCons = compose(
    over(derivations, DerivationList.fromJS),
    // @ts-ignore
    (a) => new HDAccount(a),
    assoc('index', index),
    migrateFromV3
  )

  return accountCons(account)
}

export const toJSwithIndex = pipe(HDAccount.guard, acc => {
  const accountDecons = compose(over(derivations, DerivationList.toJS))
  // @ts-ignore
  return accountDecons(acc).toJS()
})

export const toJS = compose(dissoc('index'), toJSwithIndex)

export const reviver = (jsObject) => {
  // @ts-ignore
  return new HDAccount(jsObject)
}

export const js = (label, derivations, defaultDerivation) => {
  return {
    label: label,
    archived: false,
    default_derivation: defaultDerivation || DEFAULT_DERIVATION_TYPE,
    derivations: derivations
  }
}

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
