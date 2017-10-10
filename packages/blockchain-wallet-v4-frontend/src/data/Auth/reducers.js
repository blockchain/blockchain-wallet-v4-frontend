import * as AT from './actionTypes'

import { assign } from 'services/RamdaCookingBook'

const INITIAL_STATE = {
  isLoggingIn: false,
  isAuthenticated: false,
  auth_type: 0,
  error: null
}

const auth = (state = INITIAL_STATE, action) => {
  const { type } = action
  switch (type) {
    case AT.LOGIN: {
      return assign(state, { isLoggingIn: true })
    }
    case AT.AUTHENTICATE: {
      return assign(state, { isAuthenticated: true })
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

export default auth
