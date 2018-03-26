import * as AT from './actionTypes'

export const fetchShapeshiftPair = (pair) => ({ type: AT.FETCH_SHAPESHIFT_PAIR, payload: { pair } })
export const fetchShapeshiftPairLoading = (pair) => ({ type: AT.FETCH_SHAPESHIFT_PAIR_LOADING, payload: { pair } })
export const fetchShapeshiftPairSuccess = (pair, data) => ({ type: AT.FETCH_SHAPESHIFT_PAIR_SUCCESS, payload: { pair, data } })
export const fetchShapeshiftPairFailure = (pair, message) => ({ type: AT.FETCH_SHAPESHIFT_PAIR_FAILURE, payload: { pair, message } })
