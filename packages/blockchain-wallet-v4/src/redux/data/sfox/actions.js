import * as AT from './actionTypes'

export const fetchQuote = (data) => ({ type: AT.FETCH_QUOTE, payload: data })
export const fetchQuoteLoading = () => ({ type: AT.FETCH_QUOTE_LOADING })
export const fetchQuoteSuccess = (data) => ({ type: AT.FETCH_QUOTE_SUCCESS, payload: data })
export const fetchQuoteFailure = (error) => ({ type: AT.FETCH_QUOTE_FAILURE, payload: error })

export const fetchProfile = (data) => ({ type: AT.FETCH_PROFILE, payload: data })
export const fetchProfileLoading = () => ({ type: AT.FETCH_PROFILE_LOADING })
export const fetchProfileSuccess = (data) => ({ type: AT.FETCH_PROFILE_SUCCESS, payload: data })
export const fetchProfileFailure = (error) => ({ type: AT.FETCH_PROFILE_FAILURE, payload: error })
