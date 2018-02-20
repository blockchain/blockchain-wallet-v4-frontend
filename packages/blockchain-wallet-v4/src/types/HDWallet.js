import { shift, shiftIProp } from './util'
import { pipe, compose, curry, is, range, map } from 'ramda'
import { view, over } from 'ramda-lens'
import Bitcoin from 'bitcoinjs-lib'
import BIP39 from 'bip39'

import Type from './Type'
import * as HDAccountList from './HDAccountList'
import * as HDAccount from './HDAccount'

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

export const selectSeedHex = view(seedHex)
export const selectAccounts = view(accounts)
export const selectDefaultAccountIdx = view(defaultAccountIdx)
export const selectMnemonicVerified = compose(Boolean, view(mnemonicVerified))

export const selectAccount = curry((index, hdwallet) => selectAccounts(hdwallet).get(index))

export const selectDefaultAccount = (hdwallet) => selectAccount(selectDefaultAccountIdx(hdwallet), hdwallet)

export const selectContext = compose(HDAccountList.selectContext, selectAccounts)

const shiftHDWallet = compose(shiftIProp('seed_hex', 'seedHex'), shift)

export const fromJS = (x) => {
  if (is(HDWallet, x)) { return x }
  const hdwalletCons = compose(
    over(accounts, HDAccountList.fromJS),
    hdw => shiftHDWallet(hdw).forward()
  )
  return hdwalletCons(new HDWallet(x))
}

export const toJS = pipe(HDWallet.guard, (hd) => {
  const hdwalletDecons = compose(
    hdw => shiftHDWallet(hdw).back(),
    over(accounts, HDAccountList.toJS)
  )
  return hdwalletDecons(hd).toJS()
})

export const reviver = (jsObject) => {
  return new HDWallet(jsObject)
}

export const deriveAccountNodeAtIndex = (seedHex, index, network) => {
  let seed = BIP39.mnemonicToSeed(BIP39.entropyToMnemonic(seedHex))
  let masterNode = Bitcoin.HDNode.fromSeedBuffer(seed, network)
  return masterNode.deriveHardened(44).deriveHardened(0).deriveHardened(index)
}

export const generateAccount = curry((index, label, seedHex) => {
  let node = deriveAccountNodeAtIndex(seedHex, index, Bitcoin.networks.bitcoin)
  return HDAccount.fromJS(HDAccount.js(`${label} ${index + 1}`, node))
})

export const js = (label, mnemonic, xpub, nAccounts, network) => {
  const seed = mnemonic ? BIP39.mnemonicToSeed(mnemonic) : ''
  const seedHex = mnemonic ? BIP39.mnemonicToEntropy(mnemonic) : ''
  const masterNode = mnemonic ? Bitcoin.HDNode.fromSeedBuffer(seed, network) : undefined
  const parentNode = mnemonic ? masterNode.deriveHardened(44).deriveHardened(0) : undefined
  const node = i => mnemonic ? parentNode.deriveHardened(i) : undefined
  const account = i => HDAccount.js(`${label} ${i + 1}`, node(i), xpub)
  return {
    seed_hex: seedHex,
    passphrase: '',
    mnemonic_verified: false,
    default_account_idx: 0,
    // accounts: [HDAccount.js(label, node, xpub)]
    accounts: map(account, range(0, nAccounts))
  }
}
