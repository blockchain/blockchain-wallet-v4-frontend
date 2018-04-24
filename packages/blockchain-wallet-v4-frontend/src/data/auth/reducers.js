import * as AT from './actionTypes'
import { assoc } from 'ramda'

const INITIAL_STATE = {
  isLoggingIn: false,
  isAuthenticated: false,
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
