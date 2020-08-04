import * as AT from './actionTypes'
import { assoc } from 'ramda'
import { MiscActionTypes, MiscStateType } from './types'
import Remote from '../../../remote'

const INITIAL_STATE: MiscStateType = {
  logs: Remote.NotAsked,
  captcha: Remote.NotAsked,
  pairing_code: Remote.NotAsked,
  price_24h: {
    BTC: Remote.NotAsked,
    ETH: Remote.NotAsked,
    BCH: Remote.NotAsked,
    XLM: Remote.NotAsked,
    ALGO: Remote.NotAsked,
    PAX: Remote.NotAsked,
    USDT: Remote.NotAsked,
    EUR: Remote.Success({ change: '0', movement: 'none', price: 1 }),
    GBP: Remote.Success({ change: '0', movement: 'none', price: 1 })
  },
  price_index_series: Remote.NotAsked,
  verify_email_token: Remote.NotAsked,
  handle_2fa_reset: Remote.NotAsked,
  authorize_login: Remote.NotAsked
}

export const miscReducer = (
  state = INITIAL_STATE,
  action: MiscActionTypes
): MiscStateType => {
  switch (action.type) {
    case AT.FETCH_CAPTCHA_FAILURE: {
      return assoc('captcha', Remote.Failure(action.payload), state)
    }
    case AT.FETCH_CAPTCHA_LOADING: {
      return assoc('captcha', Remote.Loading, state)
    }
    case AT.FETCH_CAPTCHA_SUCCESS: {
      return assoc('captcha', Remote.Success(action.payload), state)
    }
    case AT.FETCH_PRICE_24H_LOADING: {
      return {
        ...state,
        price_24h: {
          ...state.price_24h,
          [action.payload.base]: Remote.Loading
        }
      }
    }
    case AT.FETCH_PRICE_24H_SUCCESS: {
      return {
        ...state,
        price_24h: {
          ...state.price_24h,
          [action.payload.base]: Remote.Success(action.payload)
        }
      }
    }
    case AT.FETCH_PRICE_24H_FAILURE: {
      return {
        ...state,
        price_24h: {
          ...state.price_24h,
          [action.payload.base]: Remote.Failure(action.payload.error)
        }
      }
    }
    case AT.FETCH_PRICE_INDEX_SERIES_LOADING: {
      return assoc('price_index_series', Remote.Loading, state)
    }
    case AT.FETCH_PRICE_INDEX_SERIES_SUCCESS: {
      return assoc('price_index_series', Remote.Success(action.payload), state)
    }
    case AT.FETCH_PRICE_INDEX_SERIES_FAILURE: {
      return assoc('price_index_series', Remote.Failure(action.payload), state)
    }
    case AT.ENCODE_PAIRING_CODE_LOADING: {
      return assoc('pairing_code', Remote.Loading, state)
    }
    case AT.ENCODE_PAIRING_CODE_SUCCESS: {
      return assoc('pairing_code', Remote.Success(action.payload), state)
    }
    case AT.ENCODE_PAIRING_CODE_FAILURE: {
      return assoc('pairing_code', Remote.Failure(action.payload), state)
    }
    case AT.AUTHORIZE_LOGIN_LOADING: {
      return assoc('authorize_login', Remote.Loading, state)
    }
    case AT.AUTHORIZE_LOGIN_SUCCESS: {
      return assoc('authorize_login', Remote.Success(action.payload), state)
    }
    case AT.AUTHORIZE_LOGIN_FAILURE: {
      return assoc('authorize_login', Remote.Failure(action.payload), state)
    }
    case AT.HANDLE_2FA_RESET_LOADING: {
      return assoc('handle_2fa_reset', Remote.Loading, state)
    }
    case AT.HANDLE_2FA_RESET_SUCCESS: {
      return assoc('handle_2fa_reset', Remote.Success(action.payload), state)
    }
    case AT.HANDLE_2FA_RESET_FAILURE: {
      return assoc('handle_2fa_reset', Remote.Failure(action.payload), state)
    }
    case AT.VERIFY_EMAIL_TOKEN_LOADING: {
      return assoc('verify_email_token', Remote.Loading, state)
    }
    case AT.VERIFY_EMAIL_TOKEN_SUCCESS: {
      return assoc('verify_email_token', Remote.Success(action.payload), state)
    }
    case AT.VERIFY_EMAIL_TOKEN_FAILURE: {
      return assoc('verify_email_token', Remote.Failure(action.payload), state)
    }
    default:
      return state
  }
}

export default miscReducer
