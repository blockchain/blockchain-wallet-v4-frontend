import * as AT from './actionTypes'

// UNUSED ADDRESSES
export const deleteAddressLabel = (accountIdx, walletIdx, addressIdx, derivation) => ({
  payload: { accountIdx, addressIdx, derivation, walletIdx },
  type: AT.DELETE_ADDRESS_LABEL
})
export const deleteAddressLabelError = (walletIndex, derivation, message) => ({
  payload: { derivation, message, walletIndex },
  type: AT.DELETE_ADDRESS_LABEL_ERROR
})
export const deleteAddressLabelLoading = (walletIndex, derivation) => ({
  payload: { derivation, walletIndex },
  type: AT.DELETE_ADDRESS_LABEL_LOADING
})
export const deleteAddressLabelSuccess = (walletIndex, derivation) => ({
  payload: { derivation, walletIndex },
  type: AT.DELETE_ADDRESS_LABEL_SUCCESS
})

export const editAddressLabel = (accountIndex, walletIndex, derivation, addressIndex) => ({
  payload: { accountIndex, addressIndex, derivation, walletIndex },
  type: AT.EDIT_ADDRESS_LABEL
})
export const editAddressLabelError = (walletIndex, derivation, message) => ({
  payload: { derivation, message, walletIndex },
  type: AT.EDIT_ADDRESS_LABEL_ERROR
})
export const editAddressLabelLoading = (walletIndex, derivation) => ({
  payload: { derivation, walletIndex },
  type: AT.EDIT_ADDRESS_LABEL_LOADING
})
export const editAddressLabelSuccess = (walletIndex, derivation) => ({
  payload: { derivation, walletIndex },
  type: AT.EDIT_ADDRESS_LABEL_SUCCESS
})

export const editImportedAddressLabel = (address) => ({
  payload: { address },
  type: AT.EDIT_IMPORTED_ADDRESS_LABEL
})
export const editImportedAddressLabelError = (address, message) => ({
  payload: { address, message },
  type: AT.EDIT_ADDRESS_LABEL_ERROR
})
export const editImportedAddressLabelLoading = (address) => ({
  payload: { address },
  type: AT.EDIT_ADDRESS_LABEL_LOADING
})
export const editImportedAddressLabelSuccess = (address) => ({
  payload: { address },
  type: AT.EDIT_ADDRESS_LABEL_SUCCESS
})

export const generateNextReceiveAddress = (walletIndex, derivation) => ({
  payload: { derivation, walletIndex },
  type: AT.GENERATE_NEXT_RECEIVE_ADDRESS
})
export const generateNextReceiveAddressError = (walletIndex, derivation, message) => ({
  payload: { derivation, message, walletIndex },
  type: AT.GENERATE_NEXT_RECEIVE_ADDRESS_ERROR
})
export const generateNextReceiveAddressLoading = (walletIndex, derivation) => ({
  payload: { derivation, walletIndex },
  type: AT.GENERATE_NEXT_RECEIVE_ADDRESS_LOADING
})
export const generateNextReceiveAddressSuccess = (walletIndex, derivation, newAddress) => ({
  payload: { derivation, newAddress, walletIndex },
  type: AT.GENERATE_NEXT_RECEIVE_ADDRESS_SUCCESS
})

export const fetchUnusedAddresses = (walletIndex, derivation) => ({
  payload: { derivation, walletIndex },
  type: AT.FETCH_UNUSED_ADDRESSES
})
export const fetchUnusedAddressesError = (walletIndex, derivation, message) => ({
  payload: { derivation, message, walletIndex },
  type: AT.FETCH_UNUSED_ADDRESSES_ERROR
})
export const fetchUnusedAddressesLoading = (walletIndex, derivation) => ({
  payload: { derivation, walletIndex },
  type: AT.FETCH_UNUSED_ADDRESSES_LOADING
})
export const fetchUnusedAddressesSuccess = (walletIndex, derivation, unusedAddresses) => ({
  payload: { derivation, unusedAddresses, walletIndex },
  type: AT.FETCH_UNUSED_ADDRESSES_SUCCESS
})

// USED ADDRESSES
export const toggleUsedAddresses = (walletIndex, derivation, visible) => ({
  payload: { derivation, visible, walletIndex },
  type: AT.TOGGLE_USED_ADDRESSES
})
export const fetchUsedAddresses = (walletIndex, derivation) => ({
  payload: { derivation, walletIndex },
  type: AT.FETCH_USED_ADDRESSES
})
export const fetchUsedAddressesError = (walletIndex, derivation, message) => ({
  payload: { derivation, message, walletIndex },
  type: AT.FETCH_USED_ADDRESSES_ERROR
})
export const fetchUsedAddressesLoading = (walletIndex, derivation) => ({
  payload: { derivation, walletIndex },
  type: AT.FETCH_USED_ADDRESSES_LOADING
})
export const fetchUsedAddressesSuccess = (walletIndex, derivation, usedAddresses) => ({
  payload: { derivation, usedAddresses, walletIndex },
  type: AT.FETCH_USED_ADDRESSES_SUCCESS
})
