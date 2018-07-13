import * as AT from './actionTypes'

export const updateMetadataRoot = (payload = {}) => ({
  type: AT.UPDATE_METADATA_ROOT,
  payload
})

// FETCH_METADATA_ROOT
export const fetchMetadataRoot = () => ({ type: AT.FETCH_METADATA_ROOT })
export const fetchMetadataRootLoading = () => ({
  type: AT.FETCH_METADATA_ROOT_LOADING
})
export const fetchMetadataRootSuccess = data => ({
  type: AT.FETCH_METADATA_ROOT_SUCCESS,
  payload: data
})
export const fetchMetadataRootFailure = error => ({
  type: AT.FETCH_METADATA_ROOT_FAILURE,
  payload: error
})
