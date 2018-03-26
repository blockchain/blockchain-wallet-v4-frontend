import { assoc } from 'ramda'
import * as AT from './actionTypes.js'
import Remote from '../../../remote'

const INITIAL_STATE = {
  trade: null,
  quote: Remote.NotAsked,
  trades: Remote.NotAsked,
  profile: Remote.NotAsked,
  accounts: Remote.NotAsked,
  mediums: Remote.NotAsked,
  nextAddress: null
}

const sfoxReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.COINIFY_FETCH_PROFILE_LOADING: {
      return assoc('profile', Remote.Loading, state)
    }
    case AT.COINIFY_FETCH_PROFILE_SUCCESS: {
      return assoc('profile', Remote.Success(payload), state)
    }
    case AT.COINIFY_FETCH_PROFILE_FAILURE: {
      return assoc('profile', Remote.Failure(payload), state)
    }
    case AT.COINIFY_FETCH_QUOTE_LOADING: {
      return assoc('quote', Remote.Loading, state)
    }
    case AT.COINIFY_FETCH_QUOTE_SUCCESS: {
      return assoc('quote', Remote.Success(payload), state)
    }
    case AT.COINIFY_FETCH_QUOTE_FAILURE: {
      return assoc('quote', Remote.Failure(payload), state)
    }
    case AT.COINIFY_FETCH_RATE_QUOTE_LOADING: {
      return assoc('rateQuote', null, state)
    }
    case AT.COINIFY_FETCH_RATE_QUOTE_SUCCESS: {
      return assoc('rateQuote', payload, state)
    }
    case AT.COINIFY_FETCH_RATE_QUOTE_FAILURE: {
      return assoc('rateQuote', payload, state)
    }
    case AT.COINIFY_FETCH_TRADES_LOADING: {
      return assoc('trades', Remote.Loading, state)
    }
    case AT.COINIFY_FETCH_TRADES_SUCCESS: {
      return assoc('trades', Remote.Success(payload), state)
    }
    case AT.COINIFY_FETCH_TRADES_FAILURE: {
      return assoc('trades', Remote.Failure(payload), state)
    }
    case AT.HANDLE_TRADE_LOADING: {
      return assoc('trade', Remote.Loading, state)
    }
    case AT.HANDLE_TRADE_SUCCESS: {
      return assoc('trade', Remote.Success(payload), state)
    }
    case AT.HANDLE_TRADE_FAILURE: {
      return assoc('trade', Remote.Failure(payload), state)
    }
    case AT.SET_PROFILE_SUCCESS: {
      return assoc('profile', Remote.Success(payload), state)
    }
    case AT.SET_PROFILE_FAILURE: {
      return assoc('profile', Remote.Failure(payload), state)
    }
    case AT.UPLOAD_SUCCESS: {
      return state
    }
    case AT.UPLOAD_FAILURE: {
      return state
    }
    case AT.GET_BANK_ACCOUNTS_SUCCESS: {
      return assoc('bankAccounts', Remote.Success(payload), state)
    }
    case AT.GET_BANK_ACCOUNTS_FAILURE: {
      return assoc('bankAccounts', Remote.Failure(payload), state)
    }
    case AT.SET_BANK_ACCOUNT_SUCCESS: {
      return state
    }
    case AT.SET_BANK_ACCOUNT_FAILURE: {
      return state
    }
    case AT.COINIFY_SIGNUP_SUCCESS: {
      return assoc('profile', Remote.Success(payload), state)
    }
    case AT.COINIFY_SIGNUP_FAILURE: {
      return assoc('profile', Remote.Failure(payload), state)
    }
    case AT.SET_NEXT_ADDRESS: {
      return assoc('nextAddress', payload, state)
    }
    case AT.RESET_PROFILE: {
      return assoc('profile', null)
    }
    case AT.GET_DELEGATE_TOKEN_SUCCESS: {
      return assoc('delegateToken', payload, state)
    }
    case AT.COINIFY_SET_TOKEN: {
      return assoc('offlineToken', payload.token, state)
    }
    case AT.GET_PAYMENT_MEDIUMS_LOADING: {
      return assoc('mediums', Remote.Loading, state)
    }
    case AT.GET_PAYMENT_MEDIUMS_SUCCESS: {
      return assoc('mediums', Remote.Success(payload), state)
    }
    case AT.GET_PAYMENT_MEDIUMS_FAILURE: {
      return assoc('mediums', Remote.Failure(payload), state)
    }
    case AT.COINIFY_GET_MEDIUM_ACCOUNTS_SUCCESS: {
      return assoc('accounts', payload, state)
    }
    case AT.COINIFY_GET_MEDIUM_ACCOUNTS_FAILURE: {
      return assoc('accounts', payload, state)
    }
    default:
      return state
  }
}

export default sfoxReducer
