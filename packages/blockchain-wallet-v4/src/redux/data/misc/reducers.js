import { assoc } from 'ramda'
import * as AT from './actionTypes.js'
import Remote from '../../../remote'

const INITIAL_STATE = {
  logs: Remote.NotAsked,
  captcha: Remote.NotAsked,
  pairing_code: Remote.NotAsked,
  price_index_series: Remote.NotAsked,
  handle_2fa_reset: Remote.NotAsked,
  authorize_login: Remote.NotAsked
}

const miscReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.FETCH_CAPTCHA_LOADING: {
      return assoc('captcha', Remote.Loading, state)
    }
    case AT.FETCH_CAPTCHA_SUCCESS: {
      return assoc('captcha', Remote.Success(payload), state)
    }
    case AT.FETCH_CAPTCHA_FAILURE: {
      return assoc('captcha', Remote.Failure(payload), state)
    }
    case AT.FETCH_LOGS_LOADING: {
      return assoc('logs', Remote.Loading, state)
    }
    case AT.FETCH_LOGS_SUCCESS: {
      return assoc('logs', Remote.Success(payload), state)
    }
    case AT.FETCH_LOGS_FAILURE: {
      return assoc('logs', Remote.Failure(payload), state)
    }
    case AT.FETCH_PRICE_INDEX_SERIES_LOADING: {
      return assoc('price_index_series', Remote.Loading, state)
    }
    case AT.FETCH_PRICE_INDEX_SERIES_SUCCESS: {
      return assoc('price_index_series', Remote.Success(payload), state)
    }
    case AT.FETCH_PRICE_INDEX_SERIES_FAILURE: {
      return assoc('price_index_series', Remote.Failure(payload), state)
    }
    case AT.ENCODE_PAIRING_CODE_LOADING: {
      return assoc('pairing_code', Remote.Loading, state)
    }
    case AT.ENCODE_PAIRING_CODE_SUCCESS: {
      return assoc('pairing_code', Remote.Success(payload), state)
    }
    case AT.ENCODE_PAIRING_CODE_FAILURE: {
      return assoc('pairing_code', Remote.Failure(payload), state)
    }
    case AT.AUTHORIZE_LOGIN_LOADING: {
      return assoc('authorize_login', Remote.Loading, state)
    }
    case AT.AUTHORIZE_LOGIN_SUCCESS: {
      return assoc('authorize_login', Remote.Success(payload), state)
    }
    case AT.AUTHORIZE_LOGIN_FAILURE: {
      return assoc('authorize_login', Remote.Failure(payload), state)
    }
    case AT.HANDLE_2FA_RESET_LOADING: {
      return assoc('handle_2fa_reset', Remote.Loading, state)
    }
    case AT.HANDLE_2FA_RESET_SUCCESS: {
      return assoc('handle_2fa_reset', Remote.Success(payload), state)
    }
    case AT.HANDLE_2FA_RESET_FAILURE: {
      return assoc('handle_2fa_reset', Remote.Failure(payload), state)
    }
    default:
      return state
  }
}

export default miscReducer
