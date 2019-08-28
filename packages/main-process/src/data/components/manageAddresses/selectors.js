import { path } from 'ramda'

export const getWalletUsedAddressVisibility = (state, walletId) => {
  return path(
    ['components', 'manageAddresses', walletId, 'usedAddressesVisible'],
    state
  )
}
export const getWalletUnusedAddresses = (state, walletId) => {
  return path(
    ['components', 'manageAddresses', walletId, 'unusedAddresses'],
    state
  )
}
export const getWalletUsedAddresses = (state, walletId) => {
  return path(
    ['components', 'manageAddresses', walletId, 'usedAddresses'],
    state
  )
}
