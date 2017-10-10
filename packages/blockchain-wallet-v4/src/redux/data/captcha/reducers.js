import * as AT from './actionTypes.js'

const INITIAL_STATE = {}

const captchaReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.SET_CAPTCHA: {
      return payload
    }
    case AT.DELETE_CAPTCHA: {
      return INITIAL_STATE
    }
    default:
      return state
  }
}

export default captchaReducer
