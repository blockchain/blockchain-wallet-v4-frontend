import * as AT from './actionTypes.js'

const INITIAL_STATE = {}

const captchaReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action
  switch (type) {
    case AT.FETCH_CAPTCHA_SUCCESS: {
      return payload
    }
    case AT.CLEAR_CAPTCHA: {
      return INITIAL_STATE
    }
    default:
      return state
  }
}

export default captchaReducer
