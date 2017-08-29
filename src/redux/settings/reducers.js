import * as AT from './actionTypes'

const INITIAL_STATE = {
  btc_currency: 'BTC',
  language: 'en',
  currency: 'USD',
  country_code: 'US',
  email: '',
  email_verified: 0,
  sms_number: '',
  sms_verified: 0
}

const settingsReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.FETCH_SETTINGS_SUCCESS: {
      return payload
    }
    case AT.UPDATE_EMAIL_SUCCESS: {
      const { email } = payload
      return Object.assign({}, state, { email: email, email_verified: 0 })
    }
    case AT.VERIFY_EMAIL_SUCCESS: {
      return Object.assign({}, state, { email_verified: 1 })
    }
    case AT.UPDATE_MOBILE_SUCCESS: {
      const { mobile } = payload
      return Object.assign({}, state, { sms_number: mobile, sms_verified: 0 })
    }
    case AT.VERIFY_MOBILE_SUCCESS: {
      return Object.assign({}, state, { sms_verified: 1 })
    }
    default:
      return state
  }
}

export default settingsReducer
