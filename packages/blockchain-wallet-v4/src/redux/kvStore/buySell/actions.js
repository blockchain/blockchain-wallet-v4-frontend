import * as AT from './actionTypes'

// FETCH_METADATA_BUYSELL
export const fetchMetadataBuysell = () => ({ type: AT.FETCH_METADATA_BUYSELL })
export const fetchMetadataBuysellLoading = () => ({ type: AT.FETCH_METADATA_BUYSELL_LOADING })
export const fetchMetadataBuysellSuccess = (data) => ({ type: AT.FETCH_METADATA_BUYSELL_SUCCESS, payload: data })
export const fetchMetadataBuysellFailure = (error) => ({ type: AT.FETCH_METADATA_BUYSELL_FAILURE, payload: error })

// create
export const createMetadataBuysell = (data) => ({ type: AT.CREATE_METADATA_BUYSELL, payload: data })
