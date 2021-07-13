import * as AT from './actionTypes'

// UNUSED ADDRESSES
export const deleteAddressLabel = (
  accountIdx,
  walletIdx,
  addressIdx,
  derivation
) => ({
  type: AT.DELETE_ADDRESS_LABEL,
  payload: { accountIdx, addressIdx, derivation, walletIdx }
})
export const deleteAddressLabelError = (walletIndex, derivation, message) => ({
  type: AT.DELETE_ADDRESS_LABEL_ERROR,
  payload: { derivation, message, walletIndex }
})
export const deleteAddressLabelLoading = (walletIndex, derivation) => ({
  type: AT.DELETE_ADDRESS_LABEL_LOADING,
  payload: { derivation, walletIndex }
})
export const deleteAddressLabelSuccess = (walletIndex, derivation) => ({
  type: AT.DELETE_ADDRESS_LABEL_SUCCESS,
  payload: { derivation, walletIndex }
})

export const editAddressLabel = (
  accountIndex,
  walletIndex,
  derivation,
  addressIndex
) => ({
  type: AT.EDIT_ADDRESS_LABEL,
  payload: { accountIndex, addressIndex, derivation, walletIndex }
})
export const editAddressLabelError = (walletIndex, derivation, message) => ({
  type: AT.EDIT_ADDRESS_LABEL_ERROR,
  payload: { derivation, message, walletIndex }
})
export const editAddressLabelLoading = (walletIndex, derivation) => ({
  type: AT.EDIT_ADDRESS_LABEL_LOADING,
  payload: { derivation, walletIndex }
})
export const editAddressLabelSuccess = (walletIndex, derivation) => ({
  type: AT.EDIT_ADDRESS_LABEL_SUCCESS,
  payload: { derivation, walletIndex }
})

export const editImportedAddressLabel = address => ({
  type: AT.EDIT_IMPORTED_ADDRESS_LABEL,
  payload: { address }
})
export const editImportedAddressLabelError = (address, message) => ({
  type: AT.EDIT_ADDRESS_LABEL_ERROR,
  payload: { address, message }
})
export const editImportedAddressLabelLoading = address => ({
  type: AT.EDIT_ADDRESS_LABEL_LOADING,
  payload: { address }
})
export const editImportedAddressLabelSuccess = address => ({
  type: AT.EDIT_ADDRESS_LABEL_SUCCESS,
  payload: { address }
})

export const generateNextReceiveAddress = (walletIndex, derivation) => ({
  type: AT.GENERATE_NEXT_RECEIVE_ADDRESS,
  payload: { derivation, walletIndex }
})
export const generateNextReceiveAddressError = (
  walletIndex,
  derivation,
  message
) => ({
  type: AT.GENERATE_NEXT_RECEIVE_ADDRESS_ERROR,
  payload: { derivation, message, walletIndex }
})
export const generateNextReceiveAddressLoading = (walletIndex, derivation) => ({
  type: AT.GENERATE_NEXT_RECEIVE_ADDRESS_LOADING,
  payload: { derivation, walletIndex }
})
export const generateNextReceiveAddressSuccess = (
  walletIndex,
  derivation,
  newAddress
) => ({
  type: AT.GENERATE_NEXT_RECEIVE_ADDRESS_SUCCESS,
  payload: { derivation, newAddress, walletIndex }
})

export const fetchUnusedAddresses = (walletIndex, derivation) => ({
  type: AT.FETCH_UNUSED_ADDRESSES,
  payload: { derivation, walletIndex }
})
export const fetchUnusedAddressesError = (
  walletIndex,
  derivation,
  message
) => ({
  type: AT.FETCH_UNUSED_ADDRESSES_ERROR,
  payload: { derivation, message, walletIndex }
})
export const fetchUnusedAddressesLoading = (walletIndex, derivation) => ({
  type: AT.FETCH_UNUSED_ADDRESSES_LOADING,
  payload: { derivation, walletIndex }
})
export const fetchUnusedAddressesSuccess = (
  walletIndex,
  derivation,
  unusedAddresses
) => ({
  type: AT.FETCH_UNUSED_ADDRESSES_SUCCESS,
  payload: { derivation, walletIndex, unusedAddresses }
})

// USED ADDRESSES
export const toggleUsedAddresses = (walletIndex, derivation, visible) => ({
  type: AT.TOGGLE_USED_ADDRESSES,
  payload: { derivation, walletIndex, visible }
})
export const fetchUsedAddresses = (walletIndex, derivation) => ({
  type: AT.FETCH_USED_ADDRESSES,
  payload: { derivation, walletIndex }
})
export const fetchUsedAddressesError = (walletIndex, derivation, message) => ({
  type: AT.FETCH_USED_ADDRESSES_ERROR,
  payload: { derivation, message, walletIndex }
})
export const fetchUsedAddressesLoading = (walletIndex, derivation) => ({
  type: AT.FETCH_USED_ADDRESSES_LOADING,
  payload: { derivation, walletIndex }
})
export const fetchUsedAddressesSuccess = (
  walletIndex,
  derivation,
  usedAddresses
) => ({
  type: AT.FETCH_USED_ADDRESSES_SUCCESS,
  payload: { derivation, walletIndex, usedAddresses }
})
