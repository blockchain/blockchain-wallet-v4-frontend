import * as AT from './actionTypes'

export const toggleUsedAddresses = (walletIndex, visible) => ({ type: AT.TOGGLE_USED_ADDRESSES, payload: { walletIndex, visible } })
export const fetchUsedAddresses = (walletIndex) => ({ type: AT.FETCH_USED_ADDRESSES, payload: { walletIndex } })
export const fetchUsedAddressesLoading = (walletIndex) => ({ type: AT.FETCH_USED_ADDRESSES_LOADING, payload: { walletIndex } })
export const fetchUsedAddressesSuccess = (walletIndex, addresses) => ({ type: AT.FETCH_USED_ADDRESSES_SUCCESS, payload: { addresses, walletIndex } })
