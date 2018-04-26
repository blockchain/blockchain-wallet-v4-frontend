import * as AT from './actionTypes'
import { assoc } from 'ramda'
import { Remote } from 'blockchain-wallet-v4/src'

const INITIAL_STATE = {
  isLoggingIn: false,
  isAuthenticated: false,
  reset_2fa_error: false,
  registering: Remote.NotAsked,
  auth_type: 0,
  error: null
}

const auth = (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.LOGIN: {
      return assoc('isLoggingIn', true, state)
    }
    case AT.AUTHENTICATE: {
      return assoc('isAuthenticated', true, state)
    }
    case AT.REGISTER_LOADING: {
      return assoc('registering', Remote.Loading, state)
    }
    case AT.REGISTER_SUCCESS: {
      return assoc('registering', Remote.Success(payload), state)
    }
    case AT.REGISTER_FAILURE: {
      return assoc('registering', Remote.Failure(payload), state)
    }
    case AT.RESTORE_LOADING: {
      return assoc('registering', Remote.Loading, state)
    }
    case AT.RESTORE_SUCCESS: {
      return assoc('registering', Remote.Success(payload), state)
    }
    case AT.RESTORE_FAILURE: {
      return assoc('registering', Remote.Failure(payload), state)
    }
    case AT.RESET_2FA_ERROR: {
      return assoc('reset_2fa_error', payload.val, state)
    }
    case AT.SET_AUTH_TYPE: {
      const { authType } = payload
      return assoc('auth_type', authType, state)
    }
    case AT.SET_AUTH_ERROR: {
      const { message } = payload
      return assoc('error', message, state)
    }
    case AT.CLEAR_ERROR: {
      return assoc('error', null, state)
    }
    default:
      return state
  }
}

export default auth
