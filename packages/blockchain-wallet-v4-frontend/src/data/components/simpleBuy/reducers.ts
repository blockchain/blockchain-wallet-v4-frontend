import * as AT from './actionTypes'
import { SimpleBuyActionTypes, SimpleBuyState } from './types'
import Remote from 'blockchain-wallet-v4/src/remote/remote'

const INITIAL_STATE: SimpleBuyState = {
  account: Remote.NotAsked,
  balances: Remote.Success({
    BCH: { pending: '0', available: '0' },
    BTC: { pending: '0', available: '0' },
    ETH: { pending: '0', available: '0' },
    PAX: { pending: '0', available: '0' },
    XLM: { pending: '0', available: '0' }
  }),
  order: undefined,
  orders: Remote.NotAsked,
  cryptoCurrency: undefined,
  fiatCurrency: undefined,
  fiatEligible: Remote.NotAsked,
  pairs: Remote.NotAsked,
  quote: Remote.NotAsked,
  step: 'CURRENCY_SELECTION',
  suggestedAmounts: Remote.NotAsked
}

export function simpleBuyReducer (
  state = INITIAL_STATE,
  action: SimpleBuyActionTypes
): SimpleBuyState {
  switch (action.type) {
    case AT.DESTROY_CHECKOUT:
      return {
        ...state,
        step: 'CURRENCY_SELECTION',
        account: Remote.NotAsked,
        pairs: Remote.NotAsked,
        quote: Remote.NotAsked,
        suggestedAmounts: Remote.NotAsked
      }
    case AT.FETCH_SB_BALANCES_FAILURE: {
      return {
        ...state,
        balances: Remote.Failure(action.payload.error)
      }
    }
    case AT.FETCH_SB_BALANCES_LOADING:
      return {
        ...state,
        balances: Remote.Loading
      }
    case AT.FETCH_SB_BALANCES_SUCCESS:
      return {
        ...state,
        balances: Remote.Success(action.payload.balances)
      }
    case AT.FETCH_SB_FIAT_ELIGIBLE_FAILURE: {
      return {
        ...state,
        fiatEligible: Remote.Failure(action.payload.error)
      }
    }
    case AT.FETCH_SB_FIAT_ELIGIBLE_LOADING:
      return {
        ...state,
        fiatEligible: Remote.Loading
      }
    case AT.FETCH_SB_FIAT_ELIGIBLE_SUCCESS:
      return {
        ...state,
        fiatEligible: Remote.Success(action.payload.fiatEligible)
      }
    case AT.FETCH_SB_ORDERS_FAILURE: {
      return {
        ...state,
        orders: Remote.Failure(action.payload.error)
      }
    }
    case AT.FETCH_SB_ORDERS_LOADING:
      return {
        ...state,
        orders: Remote.Loading
      }
    case AT.FETCH_SB_ORDERS_SUCCESS:
      return {
        ...state,
        orders: Remote.Success(action.payload.orders)
      }
    case AT.FETCH_SB_PAIRS_FAILURE: {
      return {
        ...state,
        pairs: Remote.Failure(action.payload.error)
      }
    }
    case AT.FETCH_SB_PAIRS_LOADING:
      return {
        ...state,
        pairs: Remote.Loading
      }
    case AT.FETCH_SB_PAIRS_SUCCESS:
      return {
        ...state,
        pairs: Remote.Success(action.payload.pairs)
      }
    case AT.FETCH_SB_PAYMENT_ACCOUNT_FAILURE: {
      return {
        ...state,
        account: Remote.Failure(action.payload.error)
      }
    }
    case AT.FETCH_SB_PAYMENT_ACCOUNT_LOADING:
      return {
        ...state,
        account: Remote.Loading
      }
    case AT.FETCH_SB_PAYMENT_ACCOUNT_SUCCESS:
      return {
        ...state,
        account: Remote.Success(action.payload.account)
      }
    case AT.FETCH_SB_QUOTE_FAILURE: {
      return {
        ...state,
        quote: Remote.Failure(action.payload.error)
      }
    }
    case AT.FETCH_SB_QUOTE_LOADING:
      return {
        ...state,
        quote: Remote.Loading
      }
    case AT.FETCH_SB_QUOTE_SUCCESS:
      return {
        ...state,
        quote: Remote.Success(action.payload.quote)
      }
    case AT.FETCH_SB_SUGGESTED_AMOUNTS_FAILURE: {
      return {
        ...state,
        suggestedAmounts: Remote.Failure(action.payload.error)
      }
    }
    case AT.FETCH_SB_SUGGESTED_AMOUNTS_LOADING:
      return {
        ...state,
        suggestedAmounts: Remote.Loading
      }
    case AT.FETCH_SB_SUGGESTED_AMOUNTS_SUCCESS:
      return {
        ...state,
        suggestedAmounts: Remote.Success(action.payload.amounts)
      }
    case AT.SET_STEP:
      switch (action.payload.step) {
        case 'ENTER_AMOUNT':
          return {
            ...state,
            cryptoCurrency: action.payload.cryptoCurrency,
            fiatCurrency: action.payload.fiatCurrency,
            step: action.payload.step
          }
        case 'CHECKOUT_CONFIRM':
        case 'ORDER_SUMMARY':
        case 'TRANSFER_DETAILS':
        case 'CANCEL_ORDER':
          return {
            ...state,
            order: action.payload.order,
            step: action.payload.step
          }
        default: {
          return {
            ...state,
            step: action.payload.step
          }
        }
      }
    default:
      return state
  }
}
