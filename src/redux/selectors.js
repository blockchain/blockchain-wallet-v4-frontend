
import { view, compose, map } from 'ramda'
import { mapped } from 'ramda-lens'
import * as Lens from '../lens'
import { List } from 'immutable-ext'
import { selectAddresses, addresses, selectHdWallets } from '../data/Wallet'
import { selectAddr, addr } from '../data/Address'
import { accounts } from '../data/HDWallet'

// getXpubs :: WalletImmutable -> List [String]
export const getXpubs = compose(
  view(compose(mapped, Lens.xpub)),
  hs => view(compose(mapped, accounts), hs).fold(),
  selectHdWallets,
  view(Lens.walletImmutable)
)

// getAddresses :: WalletImmutableWrapper -> List [String]
export const getAddresses = compose(
  List,
  view(compose(mapped, addr)),
  selectAddresses,
  view(Lens.walletImmutable))

export const getWalletContext = w => List([getXpubs(w), getAddresses(w)]).fold()

// export const getWallet = payload => payload.get('walletImmutable')
// export const isDoubleEncrypted = wallet => wallet.get('double_encryption')

// context is a single address/xpub for now
export const getAddrInfo = dpath => context => state =>
  state[dpath].get('addressesInfo').get(context)

// context is a single address/xpub for now
export const getTransactions = dpath => context => state => {
  const info = getAddrInfo(dpath)(context)(state)
  return info ? info.get('transactions') : List([])
}
