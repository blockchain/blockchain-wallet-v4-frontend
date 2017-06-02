
import { view, compose } from 'ramda'
import { mapped } from 'ramda-lens'
import * as Lens from '../lens'
import { List } from 'immutable-ext'

// _xpubs :: [account] -> [xpub]
const _xpubs = as => view(compose(mapped, Lens.xpub), as)
// _accounts :: [hdwallet] -> [account]
const _accounts = hs => view(compose(mapped, Lens.accounts), hs).fold()
// _addresses :: {keys} -> [addresses]
const _addresses = ks => ks.keySeq().toList()

export const getXpubs = compose(_xpubs, _accounts, view(Lens.hdwallets), view(Lens.walletImmutable))
export const getAddresses = compose(_addresses, view(Lens.addresses), view(Lens.walletImmutable))
export const getWalletContext = w => List([getXpubs(w), getAddresses(w)]).fold()

export const getWallet = payload => payload.get('walletImmutable')
export const isDoubleEncrypted = wallet => wallet.get('double_encryption')

// context is a single address/xpub for now
export const getAddrInfo = dpath => context => state =>
  state[dpath].get('addressesInfo').get(context)

// context is a single address/xpub for now
export const getTransactions = dpath => context => state => {
  const info = getAddrInfo(dpath)(context)(state)
  return info ? info.get('transactions') : List([])
}
