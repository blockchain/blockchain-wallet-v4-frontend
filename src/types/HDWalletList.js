import { map, view, is, pipe } from 'ramda'
import List from './List'
import * as HDWallet from './HDWallet'

export class HDWalletList extends List {}

export const isHDWalletList = is(HDWalletList)

// we never add multiple hdwallets
// select always by default hdwallet 0
export const hdwallet = HDWalletList.define(0)

export const selectHDWallet = view(hdwallet)

export const toJS = pipe(HDWalletList.guard, (wList) => {
  return map(HDWallet.toJS, wList).toArray()
})

export const fromJS = (wallets) => {
  if (is(HDWalletList, wallets)) {
    return wallets
  } else {
    return new HDWalletList(map(HDWallet.fromJS, wallets))
  }
}

export const reviver = (jsObject) => {
  return new HDWalletList(jsObject)
}
