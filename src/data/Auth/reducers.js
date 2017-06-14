import * as actions from './actions'
import { merge } from 'ramda'

let assign = (state, next) => Object.assign({}, state, next)

const INITIAL_STATE = {
  isLoggingIn: false,
  isAuthenticated: false,
  error: null
}

const login = (state = INITIAL_STATE, action) => {
  let { type } = action
  switch (type) {
    case actions.LOGIN_START: {
      return assign(INITIAL_STATE, { isLoggingIn: true })
    }
    case actions.LOGIN_SUCCESS: {
      return assign(INITIAL_STATE, { isAuthenticated: true })
    }
    case actions.LOGIN_ERROR: {
      let { payload } = action
      return assign(INITIAL_STATE, { error: payload })
    }
    default:
      return state
  }
}

const session = (state = {}, action) => {
  let { type } = action
  switch (type) {
    case actions.SAVE_SESSION: {
      return merge(state, action.payload)
    }
    default:
      return state
  }
}

export default {
  login, session
}
