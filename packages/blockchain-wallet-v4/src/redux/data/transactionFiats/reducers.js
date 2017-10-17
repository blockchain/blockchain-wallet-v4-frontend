import * as T from './actionTypes.js'
import { assocPath } from 'ramda'

const INITIAL_STATE = {}

const transactionFiat = (state = INITIAL_STATE, action) => {
  const { type, payload } = action
  switch (type) {
    case T.SET_TRANSACTION_FIAT_AT_TIME: {
      const { coin, currency, hash, value } = payload
      return assocPath([coin, hash, currency], value, state)
    }

    default:
      return state
  }
}

export default transactionFiat
