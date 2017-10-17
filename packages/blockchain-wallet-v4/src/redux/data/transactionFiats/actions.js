import * as T from './actionTypes'

export const setTransactionFiatAtTime = (coin, currency, hash, value) => ({ type: T.SET_TRANSACTION_FIAT_AT_TIME, payload: { coin, currency, hash, value } })
