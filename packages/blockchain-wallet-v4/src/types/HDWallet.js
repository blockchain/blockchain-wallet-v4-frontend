import BIP39 from 'bip39'
import * as Bitcoin from 'bitcoinjs-lib'
import Task from 'data.task'
import { compose, curry, is, map, pipe, range } from 'ramda'
import { over, traversed, traverseOf, view } from 'ramda-lens'

import * as crypto from '../walletCrypto'
import * as Derivation from './Derivation'
import * as HDAccount from './HDAccount'
import * as HDAccountList from './HDAccountList'
import Type from './Type'
import { shift, shiftIProp } from './util'

/* HDWallet :: {
  seed_hex :: String
  accounts :: [Account]
} */

export class HDWallet extends Type {}
export const isHDWallet = is(HDWallet)
export const seedHex = HDWallet.define('seedHex')
export const accounts = HDWallet.define('accounts')
export const defaultAccountIdx = HDWallet.define('default_account_idx')
export const mnemonicVerified = HDWallet.define('mnemonic_verified')

// Lens used to traverse all secrets for double encryption
export const secretsLens = compose(accounts, traversed, HDAccount.secretsLens)

export const selectSeedHex = view(seedHex)
export const selectAccounts = view(accounts)
export const selectDefaultAccountIdx = view(defaultAccountIdx)
export const selectMnemonicVerified = compose(Boolean, view(mnemonicVerified))

export const selectAccount = curry((index, hdwallet) => selectAccounts(hdwallet).get(index))

export const selectDefaultAccount = (hdwallet) =>
  selectAccount(selectDefaultAccountIdx(hdwallet), hdwallet)

export const selectContextGrouped = compose(HDAccountList.selectContextGrouped, selectAccounts)

export const selectContext = compose(HDAccountList.selectContext, selectAccounts)

const shiftHDWallet = compose(shiftIProp('seed_hex', 'seedHex'), shift)

export const fromJS = (x) => {
  if (is(HDWallet, x)) {
    return x
  }
  const hdwalletCons = compose(over(accounts, HDAccountList.fromJS), (hdw) =>
    shiftHDWallet(hdw).forward()
  )
  return hdwalletCons(new HDWallet(x))
}

export const toJS = pipe(HDWallet.guard, (hd) => {
  const hdwalletDecons = compose(
    (hdw) => shiftHDWallet(hdw).back(),
    over(accounts, HDAccountList.toJS)
  )
  return hdwalletDecons(hd).toJS()
})

export const reviver = (jsObject) => {
  return new HDWallet(jsObject)
}

const deriveAccountNodeAtIndex = (seedHex, purpose, index, network) => {
  if (!seedHex) return
  const seed = BIP39.mnemonicToSeed(BIP39.entropyToMnemonic(seedHex))
  const masterNode = Bitcoin.bip32.fromSeed(Buffer.from(seed), network)
  return masterNode.deriveHardened(purpose).deriveHardened(0).deriveHardened(index)
}

export const generateDerivations = (seedHex, index, network) => {
  return HDAccount.DERIVATION_LIST.map(({ purpose, type }) => {
    const node = deriveAccountNodeAtIndex(seedHex, purpose, index, network)
    return Derivation.js(type, purpose, node, null)
  })
}

export const generateDerivation = curry((type, purpose, index, network, seedHex) => {
  const node = deriveAccountNodeAtIndex(seedHex, purpose, index, network)
  return Derivation.fromJS(Derivation.js(type, purpose, node, null))
})

export const generateAccount = curry((index, label, network, payloadV, seedHex) => {
  const derivations = generateDerivations(seedHex, index, network)
  return HDAccount.fromJS(HDAccount.js(label, derivations))
})

// encrypt :: Number -> String -> String -> HDWallet -> Task Error HDWallet
export const encrypt = curry((iterations, sharedKey, password, hdWallet) => {
  const cipher = crypto.encryptSecPass(sharedKey, iterations, password)
  const traverseSeed = traverseOf(seedHex, Task.of, cipher)
  const traverseAccounts = traverseOf(secretsLens, Task.of, cipher)
  return Task.of(hdWallet).chain(traverseSeed).chain(traverseAccounts)
})

// decrypt :: Number -> String -> String -> HDWallet -> Task Error HDWallet
export const decrypt = curry((iterations, sharedKey, password, hdWallet) => {
  const cipher = crypto.decryptSecPass(sharedKey, iterations, password)
  const traverseSeed = traverseOf(seedHex, Task.of, cipher)
  const traverseAccounts = traverseOf(secretsLens, Task.of, cipher)
  return Task.of(hdWallet).chain(traverseSeed).chain(traverseAccounts)
})

export const createNew = (mnemonic) =>
  fromJS({
    accounts: [],
    default_account_idx: 0,
    mnemonic_verified: false,
    passphrase: '',
    seed_hex: mnemonic ? BIP39.mnemonicToEntropy(mnemonic) : ''
  })

export const js = (label, mnemonic, nAccounts, network) => {
  const seedHex = mnemonic ? BIP39.mnemonicToEntropy(mnemonic) : ''

  const createAccountAtIndex = (i) => {
    const derivations = generateDerivations(seedHex, i, network)
    return HDAccount.js(`${label}${i > 0 ? ` ${i + 1}` : ''}`, derivations)
  }

  return {
    accounts: map(createAccountAtIndex, range(0, nAccounts)),
    default_account_idx: 0,
    mnemonic_verified: false,
    passphrase: '',
    seed_hex: seedHex
  }
}
