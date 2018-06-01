import * as AT from './actionTypes'

// UNUSED ADDRESSES
export const generateNextReceiveAddress = (walletIndex) => ({ type: AT.GENERATE_NEXT_RECEIVE_ADDRESS, payload: { walletIndex } })
export const generateNextReceiveAddressError = (walletIndex, message) => ({ type: AT.GENERATE_NEXT_RECEIVE_ADDRESS_ERROR, payload: { walletIndex, message } })
export const generateNextReceiveAddressLoading = (walletIndex) => ({ type: AT.GENERATE_NEXT_RECEIVE_ADDRESS_LOADING, payload: { walletIndex } })
export const generateNextReceiveAddressSuccess = (walletIndex) => ({ type: AT.GENERATE_NEXT_RECEIVE_ADDRESS_SUCCESS, payload: { walletIndex } })

export const fetchUnusedAddresses = (walletIndex) => ({ type: AT.FETCH_UNUSED_ADDRESSES, payload: { walletIndex } })
export const fetchUnusedAddressesError = (walletIndex, message) => ({ type: AT.FETCH_UNUSED_ADDRESSES_ERROR, payload: { walletIndex, message } })
export const fetchUnusedAddressesLoading = (walletIndex) => ({ type: AT.FETCH_UNUSED_ADDRESSES_LOADING, payload: { walletIndex } })
export const fetchUnusedAddressesSuccess = (walletIndex, unusedAddresses) => ({ type: AT.FETCH_UNUSED_ADDRESSES_SUCCESS, payload: { walletIndex, unusedAddresses } })

// USED ADDRESSES
export const toggleUsedAddresses = (walletIndex, visible) => ({ type: AT.TOGGLE_USED_ADDRESSES, payload: { walletIndex, visible } })
export const fetchUsedAddresses = (walletIndex) => ({ type: AT.FETCH_USED_ADDRESSES, payload: { walletIndex } })
export const fetchUsedAddressesError = (walletIndex, message) => ({ type: AT.FETCH_USED_ADDRESSES_ERROR, payload: { walletIndex, message } })
export const fetchUsedAddressesLoading = (walletIndex) => ({ type: AT.FETCH_USED_ADDRESSES_LOADING, payload: { walletIndex } })
export const fetchUsedAddressesSuccess = (walletIndex, usedAddresses) => ({ type: AT.FETCH_USED_ADDRESSES_SUCCESS, payload: { walletIndex, usedAddresses } })
