import * as AT from './actionTypes'

// UNUSED ADDRESSES
export const deleteAddressLabel = (accountIdx, walletIdx, addressIdx) => ({
  type: AT.DELETE_ADDRESS_LABEL,
  payload: { accountIdx, walletIdx, addressIdx }
})
export const deleteAddressLabelError = (walletIndex, message) => ({
  type: AT.DELETE_ADDRESS_LABEL_ERROR,
  payload: { walletIndex, message }
})
export const deleteAddressLabelLoading = walletIndex => ({
  type: AT.DELETE_ADDRESS_LABEL_LOADING,
  payload: { walletIndex }
})
export const deleteAddressLabelSuccess = walletIndex => ({
  type: AT.DELETE_ADDRESS_LABEL_SUCCESS,
  payload: { walletIndex }
})

export const editAddressLabel = (accountIndex, walletIndex, addressIndex) => ({
  type: AT.EDIT_ADDRESS_LABEL,
  payload: { accountIndex, walletIndex, addressIndex }
})
export const editAddressLabelError = (walletIndex, message) => ({
  type: AT.EDIT_ADDRESS_LABEL_ERROR,
  payload: { walletIndex, message }
})
export const editAddressLabelLoading = walletIndex => ({
  type: AT.EDIT_ADDRESS_LABEL_LOADING,
  payload: { walletIndex }
})
export const editAddressLabelSuccess = walletIndex => ({
  type: AT.EDIT_ADDRESS_LABEL_SUCCESS,
  payload: { walletIndex }
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

export const generateNextReceiveAddress = walletIndex => ({
  type: AT.GENERATE_NEXT_RECEIVE_ADDRESS,
  payload: { walletIndex }
})
export const generateNextReceiveAddressError = (walletIndex, message) => ({
  type: AT.GENERATE_NEXT_RECEIVE_ADDRESS_ERROR,
  payload: { walletIndex, message }
})
export const generateNextReceiveAddressLoading = walletIndex => ({
  type: AT.GENERATE_NEXT_RECEIVE_ADDRESS_LOADING,
  payload: { walletIndex }
})
export const generateNextReceiveAddressSuccess = (walletIndex, newAddress) => ({
  type: AT.GENERATE_NEXT_RECEIVE_ADDRESS_SUCCESS,
  payload: { walletIndex, newAddress }
})

export const fetchUnusedAddresses = walletIndex => ({
  type: AT.FETCH_UNUSED_ADDRESSES,
  payload: { walletIndex }
})
export const fetchUnusedAddressesError = (walletIndex, message) => ({
  type: AT.FETCH_UNUSED_ADDRESSES_ERROR,
  payload: { walletIndex, message }
})
export const fetchUnusedAddressesLoading = walletIndex => ({
  type: AT.FETCH_UNUSED_ADDRESSES_LOADING,
  payload: { walletIndex }
})
export const fetchUnusedAddressesSuccess = (walletIndex, unusedAddresses) => ({
  type: AT.FETCH_UNUSED_ADDRESSES_SUCCESS,
  payload: { walletIndex, unusedAddresses }
})

// USED ADDRESSES
export const toggleUsedAddresses = (walletIndex, visible) => ({
  type: AT.TOGGLE_USED_ADDRESSES,
  payload: { walletIndex, visible }
})
export const fetchUsedAddresses = walletIndex => ({
  type: AT.FETCH_USED_ADDRESSES,
  payload: { walletIndex }
})
export const fetchUsedAddressesError = (walletIndex, message) => ({
  type: AT.FETCH_USED_ADDRESSES_ERROR,
  payload: { walletIndex, message }
})
export const fetchUsedAddressesLoading = walletIndex => ({
  type: AT.FETCH_USED_ADDRESSES_LOADING,
  payload: { walletIndex }
})
export const fetchUsedAddressesSuccess = (walletIndex, usedAddresses) => ({
  type: AT.FETCH_USED_ADDRESSES_SUCCESS,
  payload: { walletIndex, usedAddresses }
})
