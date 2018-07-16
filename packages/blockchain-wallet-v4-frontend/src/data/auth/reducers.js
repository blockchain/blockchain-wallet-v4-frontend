import * as AT from './actionTypes'
import { assoc } from 'ramda'
import { Remote } from 'blockchain-wallet-v4/src'

const INITIAL_STATE = {
  auth_type: 0,
  isLoggingIn: false,
  isAuthenticated: false,
  login: Remote.NotAsked,
  reset_2fa: Remote.NotAsked,
  restoring: Remote.NotAsked,
  registering: Remote.NotAsked
}

const auth = (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.LOGIN: {
      return assoc('isLoggingIn', true, state)
    }
    case AT.LOGIN_LOADING: {
      return assoc('login', Remote.Loading, state)
    }
    case AT.LOGIN_SUCCESS: {
      return assoc('login', Remote.Success(payload), state)
    }
    case AT.LOGIN_FAILURE: {
      return assoc('login', Remote.Failure(payload), state)
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
      return assoc('restoring', Remote.Loading, state)
    }
    case AT.RESTORE_SUCCESS: {
      return assoc('restoring', Remote.Success(payload), state)
    }
    case AT.RESTORE_FAILURE: {
      return assoc('restoring', Remote.Failure(payload), state)
    }
    case AT.RESET_2FA_LOADING: {
      return assoc('reset_2fa', Remote.Loading, state)
    }
    case AT.RESET_2FA_SUCCESS: {
      return assoc('reset_2fa', Remote.Success(payload), state)
    }
    case AT.RESET_2FA_FAILURE: {
      return assoc('reset_2fa', Remote.Failure(payload), state)
    }
    case AT.SET_AUTH_TYPE: {
      const { authType } = payload
      return assoc('auth_type', authType, state)
    }
    default:
      return state
  }
}

export default auth
