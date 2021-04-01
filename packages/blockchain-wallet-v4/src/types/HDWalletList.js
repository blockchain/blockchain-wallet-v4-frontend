import { is, map, pipe } from 'ramda'
import { view } from 'ramda-lens'

import * as HDWallet from './HDWallet'
import List from './List'

export class HDWalletList extends List {}

export const isHDWalletList = is(HDWalletList)

// we never add multiple hdwallets
// select always by default hdwallet 0
export const hdwallet = HDWalletList.define(0)

export const selectHDWallet = view(hdwallet)

export const toJS = pipe(HDWalletList.guard, wList => {
  return map(HDWallet.toJS, wList).toArray()
})

export const fromJS = wallets => {
  if (is(HDWalletList, wallets)) {
    return wallets
  } else {
    const ws = wallets || []
    return new HDWalletList(map(HDWallet.fromJS, ws))
  }
}

export const createNew = (
  guid,
  password,
  sharedKey,
  mnemonic,
  firstAccountName = 'Private Key Wallet',
  nAccounts = 1
) =>
  fromJS([
    HDWallet.js(firstAccountName, mnemonic, undefined, nAccounts, undefined)
  ])

export const reviver = jsObject => {
  return new HDWalletList(jsObject)
}
