import { path } from 'ramda'

export const getWalletUsedAddressVisibility = (state, walletId) => {
  return path(['components', 'usedAddresses', walletId, 'visible'], state)
}
export const getWalletUsedAddresses = (state, walletId) => {
  return path(['components', 'usedAddresses', walletId, 'addresses'], state)
}
