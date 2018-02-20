import * as AT from './actionTypes'

// FETCH_METADATA_BUYSELL
export const fetchMetadataBuySell = () => ({ type: AT.FETCH_METADATA_BUYSELL })
export const fetchMetadataBuySellLoading = () => ({ type: AT.FETCH_METADATA_BUYSELL_LOADING })
export const fetchMetadataBuySellSuccess = (data) => ({ type: AT.FETCH_METADATA_BUYSELL_SUCCESS, payload: data })
export const fetchMetadataBuySellFailure = (error) => ({ type: AT.FETCH_METADATA_BUYSELL_FAILURE, payload: error })

// create
export const createMetadataBuysell = (data) => ({ type: AT.CREATE_METADATA_BUYSELL, payload: data })
