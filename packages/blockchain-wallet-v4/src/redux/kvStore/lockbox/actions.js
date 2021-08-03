import * as AT from './actionTypes'

// CREATE
export const createMetadataLockbox = (data) => ({
  payload: data,
  type: AT.CREATE_METADATA_LOCKBOX
})

// FETCH
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
