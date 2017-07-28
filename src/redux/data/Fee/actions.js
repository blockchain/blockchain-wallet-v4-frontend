import * as T from './actionTypes'

export const fetchFee = () => ({ type: T.FETCH_FEE })
export const fetchFeeSuccess = (data) => ({ type: T.FETCH_FEE_SUCCESS, payload: data })
export const fetchFeeError = (data) => ({ type: T.FETCH_FEE_ERROR, payload: data })
export const deleteFee = () => ({ type: T.DELETE_FEE })
