import { Map, List, fromJS as iFromJS } from 'immutable-ext'
import * as R from 'ramda'
import { iLensProp } from '../lens'
import { typeDef, shift, shiftIProp } from '../util'
import Bitcoin from 'bitcoinjs-lib'
import BIP39 from 'bip39'
import * as HDAccount from './HDAccount'

/* HDWallet :: {
  seed_hex :: String
  accounts :: [Account]
} */

function HDWallet (x) {
  this.__internal = Map(x)
}

const { guard, define } = typeDef(HDWallet)

export const seedHex = define('seedHex')
export const accounts = define('accounts')
export const defaultAccountIdx = define('default_account_idx')

export const selectSeedHex = R.view(seedHex)
export const selectAccounts = R.view(accounts)
export const selectDefaultAccountIdx = R.view(defaultAccountIdx)

export const selectAccount = R.curry((index, hdwallet) =>
  selectAccounts(hdwallet).get(index))

export const selectDefaultAccount = (hdwallet) =>
  selectAccount(selectDefaultAccountIdx(hdwallet), hdwallet)

export const selectXpubs = R.compose(R.map(HDAccount.selectXpub), selectAccounts)

const shiftHDWallet = R.compose(shiftIProp('seed_hex', 'seedHex'), shift)

export const fromJS = (x) => {
  if (x instanceof HDWallet) { return x }
  let hdAccountListCons = R.compose(List, R.map(HDAccount.fromJS))
  let HDWalletCons = R.compose(
    R.over(accounts, hdAccountListCons)
  )
  return HDWalletCons(new HDWallet(shiftHDWallet(iFromJS(x)).forward()))
}

export const toJS = R.pipe(guard, (hd) => {
  let selectAccountsJS = R.compose(R.map(HDAccount.toJS), selectAccounts)
  let destructAccounts = R.set(accounts, selectAccountsJS(hd))
  let destructHDWallet = R.compose(destructAccounts)
  return shiftHDWallet(destructHDWallet(hd).__internal).back().toJS()
})

export const createNew = R.curry((mnemonic, { label } = {}) => {
  let seed = BIP39.mnemonicToSeed(mnemonic)
  let entropy = BIP39.mnemonicToEntropy(mnemonic)
  let masterNode = Bitcoin.HDNode.fromSeedBuffer(seed)
  let accountNode = masterNode.deriveHardened(44).deriveHardened(0).deriveHardened(0)
  let account = HDAccount.createNew(accountNode, { label })

  return fromJS({
    seed_hex: entropy,
    passphrase: '',
    mnemonic_verified: false,
    default_account_idx: 0,
    accounts: [HDAccount.toJS(account)]
  })
})
