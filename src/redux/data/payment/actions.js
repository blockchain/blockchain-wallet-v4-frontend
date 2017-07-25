import * as T from './actionTypes'

export const getUnspents = (value) => ({
  type: T.PAYMENT_GET_UNSPENTS,
  payload: value
})
export const getUnspentsSuccess = (coins) => ({
  type: T.PAYMENT_GET_UNSPENTS_SUCCESS,
  payload: coins
})
export const getUnspentsError = (message) => ({
  type: T.PAYMENT_GET_UNSPENTS_ERROR,
  payload: message
})

export const refreshSelection = (feePerByte, target, coins, change, algorithm, seed) => ({
  type: T.REFRESH_SELECTION,
  payload: {feePerByte, target, coins, change, algorithm, seed}
})
