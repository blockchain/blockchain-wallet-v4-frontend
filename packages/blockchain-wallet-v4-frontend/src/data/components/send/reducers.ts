import * as AT from './actionTypes'
import { Remote } from 'blockchain-wallet-v4/src'
import { SendState } from './types'

const INITIAL_STATE: SendState = {
  exchangePaymentsAccount: {
    BTC: Remote.NotAsked,
    BCH: Remote.NotAsked,
    ETH: Remote.NotAsked,
    PAX: Remote.NotAsked,
    XLM: Remote.NotAsked,
    USDT: Remote.NotAsked,
    ALGO: Remote.NotAsked
  }
}

export function sendReducer (state = INITIAL_STATE, action) {
  const { type, payload } = action

  switch (type) {
    case AT.FETCH_PAYMENTS_ACCOUNT_EXCHANGE_SUCCESS: {
      const { currency, data } = payload
      return {
        ...state,
        exchangePaymentsAccount: {
          ...state.exchangePaymentsAccount,
          [currency]: Remote.Success(data)
        }
      }
    }
    case AT.FETCH_PAYMENTS_ACCOUNT_EXCHANGE_LOADING: {
      const { currency } = payload
      return {
        ...state,
        exchangePaymentsAccount: {
          ...state.exchangePaymentsAccount,
          [currency]: Remote.Loading
        }
      }
    }
    case AT.FETCH_PAYMENTS_ACCOUNT_EXCHANGE_FAILURE: {
      const { currency, e } = payload
      return {
        ...state,
        exchangePaymentsAccount: {
          ...state.exchangePaymentsAccount,
          [currency]: Remote.Failure(e)
        }
      }
    }
    default:
      return state
  }
}
