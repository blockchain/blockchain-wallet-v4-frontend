import { path } from 'ramda'

export const getWalletUsedAddressVisibility = (state, walletId) => {
  return path(['components', 'usedAddresses', walletId, 'visible'], state)
}
