import * as AT from './actionTypes'

// FETCH_SHAPESHIFT_ORDER
export const fetchOrder = (depositAmount, pair, returnAddress, withdrawal) => ({ type: AT.FETCH_SHAPESHIFT_ORDER, payload: { depositAmount, pair, returnAddress, withdrawal } })
export const fetchOrderLoading = () => ({ type: AT.FETCH_SHAPESHIFT_ORDER_LOADING })
export const fetchOrderSuccess = (data) => ({ type: AT.FETCH_SHAPESHIFT_ORDER_SUCCESS, payload: data })
export const fetchOrderFailure = (error) => ({ type: AT.FETCH_SHAPESHIFT_ORDER_FAILURE, payload: error })

// FETCH_SHAPESHIFT_PAIR
export const fetchPair = (pair) => ({ type: AT.FETCH_SHAPESHIFT_PAIR, payload: { pair } })
export const fetchPairLoading = (pair) => ({ type: AT.FETCH_SHAPESHIFT_PAIR_LOADING, payload: { pair } })
export const fetchPairSuccess = (pair, data) => ({ type: AT.FETCH_SHAPESHIFT_PAIR_SUCCESS, payload: { pair, data } })
export const fetchPairFailure = (pair, message) => ({ type: AT.FETCH_SHAPESHIFT_PAIR_FAILURE, payload: { pair, message } })
