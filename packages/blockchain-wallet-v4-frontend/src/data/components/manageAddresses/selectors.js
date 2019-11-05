import { path } from 'ramda'

export const getWalletUsedAddressVisibility = (state, walletId, derivation) => {
  return path(
    [
      'components',
      'manageAddresses',
      walletId,
      derivation,
      'usedAddressesVisible'
    ],
    state
  )
}
export const getWalletUnusedAddresses = (state, walletId, derivation) => {
  return path(
    ['components', 'manageAddresses', walletId, derivation, 'unusedAddresses'],
    state
  )
}
export const getWalletUsedAddresses = (state, walletId, derivation) => {
  return path(
    ['components', 'manageAddresses', walletId, derivation, 'usedAddresses'],
    state
  )
}
