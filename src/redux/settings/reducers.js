import * as AT from './actionTypes'

const INITIAL_STATE = {
  btc_currency: 'BTC',
  language: 'en',
  currency: 'USD',
  country_code: 'US',
  email: '',
  email_verified: 0,
  sms_number: '',
  sms_verified: 0,
  auto_logout: 10
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
    case AT.UPDATE_LANGUAGE_SUCCESS: {
      const { language } = payload
      return Object.assign({}, state, { language: language })
    }
    case AT.UPDATE_CURRENCY_SUCCESS: {
      const { currency } = payload
      return Object.assign({}, state, { currency: currency })
    }
    case AT.UPDATE_BITCOIN_UNIT_SUCCESS: {
      const { unit } = payload
      return Object.assign({}, state, { btc_currency: unit })
    }
    case AT.UPDATE_AUTO_LOGOUT_SUCCESS: {
      const { autoLogout } = payload
      return Object.assign({}, state, { auto_logout: autoLogout })
    }
    default:
      return state
  }
}

export default settingsReducer
