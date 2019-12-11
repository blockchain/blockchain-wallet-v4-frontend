import * as AT from './actionTypes'

// EIDT LABEL
export const editImportedAddressLabel = address => ({
  type: AT.EDIT_IMPORTED_ADDRESS_LABEL,
  payload: { address }
})
export const editImportedAddressLabelError = address => ({
  type: AT.EDIT_IMPORTED_ADDRESS_LABEL_ERROR,
  payload: { address }
})
export const editImportedAddressLabelLoading = address => ({
  type: AT.EDIT_IMPORTED_ADDRESS_LABEL_LOADING,
  payload: { address }
})
export const editImportedAddressLabelSuccesss = address => ({
  type: AT.EDIT_IMPORTED_ADDRESS_LABEL_SUCCESS,
  payload: { address }
})
