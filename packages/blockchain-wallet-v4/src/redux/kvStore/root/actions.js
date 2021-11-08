import * as AT from './actionTypes'

export const updateMetadataRoot = (payload = {}) => ({
  payload,
  type: AT.UPDATE_METADATA_ROOT
})

// FETCH_METADATA_ROOT
export const fetchMetadataRoot = () => ({ type: AT.FETCH_METADATA_ROOT })
export const fetchMetadataRootLoading = () => ({
  type: AT.FETCH_METADATA_ROOT_LOADING
})
export const fetchMetadataRootSuccess = (data) => ({
  payload: data,
  type: AT.FETCH_METADATA_ROOT_SUCCESS
})
export const fetchMetadataRootFailure = (error) => ({
  payload: error,
  type: AT.FETCH_METADATA_ROOT_FAILURE
})
