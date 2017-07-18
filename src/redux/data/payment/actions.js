import * as T from './actionTypes'

export const getUnspents = (value) => ({
  type: T.PAYMENT_GET_UNSPENTS,
  payload: value
})

export const getUnspentsSuccess = (coins) => ({
  type: T.PAYMENT_GET_UNSPENTS_SUCCESS,
  payload: coins
})
