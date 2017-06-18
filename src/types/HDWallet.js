import { List, fromJS as iFromJS } from 'immutable-ext'
import { shift, shiftIProp, JSToI } from '../util'
import { view, prop, pipe, compose, set, over, map, curry, is } from 'ramda'
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

export const seedHex = HDWallet.define('seedHex')
export const accounts = HDWallet.define('accounts')
export const defaultAccountIdx = HDWallet.define('default_account_idx')

export const selectSeedHex = view(seedHex)
export const selectAccounts = view(accounts)
export const selectDefaultAccountIdx = view(defaultAccountIdx)

export const selectAccount = curry((index, hdwallet) =>
  selectAccounts(hdwallet).get(index))

export const selectDefaultAccount = (hdwallet) =>
  selectAccount(selectDefaultAccountIdx(hdwallet), hdwallet)

export const selectXpubs = compose(map(HDAccount.selectXpub), selectAccounts)

const shiftHDWallet = compose(shiftIProp('seed_hex', 'seedHex'), shift)

export const fromJS = (x) => {
  if (is(HDWallet, x)) { return x }
  const hdwalletCons = compose(
    // over(hdWallets, hdWalletListCons),
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

// export const reviver = (x) => {
//   // const JSONtoAccs = R.over(R.lensProp('accounts'), List)
//   // return new HDWallet(JSONtoAccs(x))
//   return new HDWallet(JSToI(x))
// }

// export const createNew = R.curry((mnemonic, { label } = {}) => {
//   let seed = BIP39.mnemonicToSeed(mnemonic)
//   let entropy = BIP39.mnemonicToEntropy(mnemonic)
//   let masterNode = Bitcoin.HDNode.fromSeedBuffer(seed)
//   let accountNode = masterNode.deriveHardened(44).deriveHardened(0).deriveHardened(0)
//   let account = HDAccount.createNew(accountNode, { label })

//   return fromJS({
//     seed_hex: entropy,
//     passphrase: '',
//     mnemonic_verified: false,
//     default_account_idx: 0,
//     accounts: [HDAccount.toJS(account)]
//   })
// })
