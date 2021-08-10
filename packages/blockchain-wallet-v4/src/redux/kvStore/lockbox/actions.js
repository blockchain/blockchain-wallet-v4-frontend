import * as AT from './actionTypes'

export const fetchMetadataLockbox = () => ({
  type: AT.FETCH_METADATA_LOCKBOX
})
export const fetchMetadataLockboxLoading = () => ({
  type: AT.FETCH_METADATA_LOCKBOX_LOADING
})
export const fetchMetadataLockboxSuccess = (data) => ({
  payload: data,
  type: AT.FETCH_METADATA_LOCKBOX_SUCCESS
})
export const fetchMetadataLockboxFailure = (error) => ({
  payload: error,
  type: AT.FETCH_METADATA_LOCKBOX_FAILURE
})
