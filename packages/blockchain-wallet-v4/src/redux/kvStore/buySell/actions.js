import * as AT from './actionTypes'

export const setSfoxTradesBuySell = (payload) => ({ type: AT.SET_SFOX_TRADES_BUYSELL, payload })
export const updateMetadataBuySell = (payload = {}) => ({ type: AT.UPDATE_METADATA_BUYSELL, payload })

export const setCoinifyTradesBuySell = (payload) => ({ type: AT.SET_COINIFY_TRADES_BUYSELL, payload })
// FETCH_METADATA_BUYSELL
export const fetchMetadataBuySell = () => ({ type: AT.FETCH_METADATA_BUYSELL })
export const fetchMetadataBuySellLoading = () => ({ type: AT.FETCH_METADATA_BUYSELL_LOADING })
export const fetchMetadataBuySellSuccess = (data) => ({ type: AT.FETCH_METADATA_BUYSELL_SUCCESS, payload: data })
export const fetchMetadataBuySellFailure = (error) => ({ type: AT.FETCH_METADATA_BUYSELL_FAILURE, payload: error })

// create
export const createMetadataBuysell = (data) => ({ type: AT.CREATE_METADATA_BUYSELL, payload: data })

export const sfoxSetProfileBuySell = (payload) => ({ type: AT.SFOX_SET_PROFILE_BUYSELL, payload })
export const coinifySetProfileBuySell = (payload) => ({ type: AT.COINIFY_SET_PROFILE_BUYSELL, payload })

export const wipeExternal = () => ({ type: AT.WIPE_EXTERNAL })
export const wipeExternalSfox = () => ({ type: AT.WIPE_EXTERNAL_SFOX })
