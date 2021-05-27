import { assoc } from 'ramda'

import Remote from '../../../remote'
import * as AT from './actionTypes'
import { initialPriceChange } from './model'
import { MiscActionTypes, MiscStateType } from './types'

const INITIAL_STATE: MiscStateType = {
  authorize_login: Remote.NotAsked,
  handle_2fa_reset: Remote.NotAsked,
  logs: Remote.NotAsked,
  pairing_code: Remote.NotAsked,
  price_change: {
    all: initialPriceChange,
    day: initialPriceChange,
    month: initialPriceChange,
    week: initialPriceChange,
    year: initialPriceChange
  },
  price_index_series: Remote.NotAsked,
  verify_email_token: Remote.NotAsked
}

export const miscReducer = (state = INITIAL_STATE, action: MiscActionTypes): MiscStateType => {
  switch (action.type) {
    case AT.FETCH_PRICE_CHANGE_LOADING: {
      return {
        ...state,
        price_change: {
          ...state.price_change,
          [action.payload.range]: {
            ...state.price_change[action.payload.range],
            [action.payload.base]: Remote.Loading
          }
        }
      }
    }
    case AT.FETCH_PRICE_CHANGE_SUCCESS: {
      return {
        ...state,
        price_change: {
          ...state.price_change,
          [action.payload.range]: {
            ...state.price_change[action.payload.range],
            [action.payload.base]: Remote.Success(action.payload)
          }
        }
      }
    }
    case AT.FETCH_PRICE_CHANGE_FAILURE: {
      return {
        ...state,
        price_change: {
          ...state.price_change,
          [action.payload.range]: {
            ...state.price_change[action.payload.range],
            [action.payload.base]: Remote.Failure(action.payload.error)
          }
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
