import * as AT from './actionTypes'

// FETCH_METADATA_BCH
export const fetchMetadataBch = () => ({ type: AT.FETCH_METADATA_BCH })
export const fetchMetadataBchLoading = () => ({ type: AT.FETCH_METADATA_BCH_LOADING })
export const fetchMetadataBchSuccess = (data) => ({ type: AT.FETCH_METADATA_BCH_SUCCESS, payload: data })
export const fetchMetadataBchFailure = (error) => ({ type: AT.FETCH_METADATA_BCH_FAILURE, payload: error })

// create
export const createMetadataBch = (data) => ({ type: AT.CREATE_METADATA_BCH, payload: data })
