import * as AT from './actionTypes'
import { merge } from 'ramda'
import { assign } from 'services/RamdaCookingBook'

const INITIAL_STATE = {
  isLoggingIn: false,
  isAuthenticated: false,
  auth_type: 0,
  error: null
}

const login = (state = INITIAL_STATE, action) => {
  const { type } = action
  switch (type) {
    case AT.LOGIN_START: {
      return assign(state, { isLoggingIn: true })
    }
    case AT.LOGIN_SUCCESS: {
      return assign(state, { isAuthenticated: true })
    }
    case AT.LOGIN_ERROR: {
      const { payload } = action
      return assign(state, { error: payload })
    }
    case AT.SET_AUTH_TYPE: {
      const { payload } = action
      const { authType } = payload
      return assign(state, { authType })
    }
    default:
      return state
  }
}

const session = (state = {}, action) => {
  let { type } = action
  switch (type) {
    case AT.SAVE_SESSION: {
      return merge(state, action.payload)
    }
    default:
      return state
  }
}

export default {
  login, session
}
