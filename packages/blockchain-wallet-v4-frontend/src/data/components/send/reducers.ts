import Remote from 'blockchain-wallet-v4/src/remote/remote'

import * as AT from './actionTypes'
import { SendActionTypes, SendState } from './types'

const INITIAL_STATE: SendState = {
  exchangePaymentsAccount: {
    AAVE: Remote.NotAsked,
    ALGO: Remote.NotAsked,
    BCH: Remote.NotAsked,
    BTC: Remote.NotAsked,
    DOT: Remote.NotAsked,
    ETH: Remote.NotAsked,
    PAX: Remote.NotAsked,
    USDT: Remote.NotAsked,
    WDGLD: Remote.NotAsked,
    XLM: Remote.NotAsked,
    YFI: Remote.NotAsked
  },
  tradingPaymentsAccount: {
    AAVE: Remote.NotAsked,
    ALGO: Remote.NotAsked,
    BCH: Remote.NotAsked,
    BTC: Remote.NotAsked,
    DOT: Remote.NotAsked,
    ETH: Remote.NotAsked,
    PAX: Remote.NotAsked,
    USDT: Remote.NotAsked,
    WDGLD: Remote.NotAsked,
    XLM: Remote.NotAsked,
    YFI: Remote.NotAsked
  },
  unstoppableDomainResults: Remote.NotAsked,
  withdrawLockCheck: Remote.NotAsked
}

export function sendReducer(state = INITIAL_STATE, action: SendActionTypes): SendState {
  switch (action.type) {
    case AT.FETCH_PAYMENTS_ACCOUNT_EXCHANGE_SUCCESS: {
      const { currency, data } = action.payload
      return {
        ...state,
        exchangePaymentsAccount: {
          ...state.exchangePaymentsAccount,
          [currency]: Remote.Success(data)
        }
      }
    }
    case AT.FETCH_PAYMENTS_ACCOUNT_EXCHANGE_LOADING: {
      const { currency } = action.payload
      return {
        ...state,
        exchangePaymentsAccount: {
          ...state.exchangePaymentsAccount,
          [currency]: Remote.Loading
        }
      }
    }
    case AT.FETCH_PAYMENTS_ACCOUNT_EXCHANGE_FAILURE: {
      const { currency, e } = action.payload
      return {
        ...state,
        exchangePaymentsAccount: {
          ...state.exchangePaymentsAccount,
          [currency]: Remote.Failure(e)
        }
      }
    }
    case AT.FETCH_PAYMENTS_TRADING_ACCOUNTS_SUCCESS: {
      const { currency, tradingAccount } = action.payload
      return {
        ...state,
        tradingPaymentsAccount: {
          ...state.tradingPaymentsAccount,
          [currency]: Remote.Success(tradingAccount)
        }
      }
    }
    case AT.FETCH_PAYMENTS_TRADING_ACCOUNTS_LOADING: {
      const { currency } = action.payload
      return {
        ...state,
        tradingPaymentsAccount: {
          ...state.tradingPaymentsAccount,
          [currency]: Remote.Loading
        }
      }
    }
    case AT.FETCH_PAYMENTS_TRADING_ACCOUNTS_FAILURE: {
      const { currency, e } = action.payload
      return {
        ...state,
        tradingPaymentsAccount: {
          ...state.tradingPaymentsAccount,
          [currency]: Remote.Failure(e)
        }
      }
    }
    case AT.FETCH_UNSTOPPABLE_DOMAIN_RESULTS_LOADING: {
      return {
        ...state,
        unstoppableDomainResults: Remote.Loading
      }
    }
    case AT.FETCH_UNSTOPPABLE_DOMAIN_RESULTS_SUCCESS: {
      return {
        ...state,
        unstoppableDomainResults: Remote.Success(action.payload.data)
      }
    }
    case AT.FETCH_UNSTOPPABLE_DOMAIN_RESULTS_FAILURE: {
      return {
        ...state,
        unstoppableDomainResults: Remote.Failure(action.payload.e)
      }
    }
    case AT.FETCH_UNSTOPPABLE_DOMAIN_RESULTS_NOT_ASKED: {
      return {
        ...state,
        unstoppableDomainResults: Remote.NotAsked
      }
    }
    case AT.GET_LOCK_RULE_LOADING: {
      return {
        ...state,
        withdrawLockCheck: Remote.Loading
      }
    }
    case AT.GET_LOCK_RULE_SUCCESS: {
      return {
        ...state,
        withdrawLockCheck: Remote.Success(action.payload.withdrawalLockCheckResponse)
      }
    }
    case AT.GET_LOCK_RULE_FAILURE: {
      return {
        ...state,
        withdrawLockCheck: Remote.Failure(action.payload.e)
      }
    }
    default:
      return state
  }
}
