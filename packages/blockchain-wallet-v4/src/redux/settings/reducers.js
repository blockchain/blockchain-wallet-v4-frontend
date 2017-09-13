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
  auto_logout: 10,
  logging_level: 0,
  ip_lock: '',
  ip_lock_on: 0
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

    case AT.UPDATE_LOGGING_LEVEL_SUCCESS: {
      const { loggingLevel } = payload
      return Object.assign({}, state, { logging_level: loggingLevel })
    }
    case AT.UPDATE_IP_LOCK_SUCCESS: {
      const { ipLock } = payload
      console.log(`Ip lock is ${ipLock}`)
      if (ipLock === '') {
        console.log(`Ip lock empty`)
        return Object.assign({}, state, { ip_lock: ipLock, ip_lock_on: 0 })
      } else {
        console.log(`Ip lock not empty`)
        return Object.assign({}, state, { ip_lock: ipLock })
      }
    }
    case AT.UPDATE_IP_LOCK_ON_SUCCESS: {
      const { ipLockOn } = payload
      return Object.assign({}, state, { ip_lock_on: ipLockOn })
    }
    case AT.UPDATE_BLOCK_TOR_IPS_SUCCESS: {
      const { blockTorIps } = payload
      return Object.assign({}, state, { block_tor_ips: blockTorIps })
    }
    case AT.UPDATE_HINT_SUCCESS: {
      const { hint } = payload
      return Object.assign({}, state, { password_hint1: hint })
    }
    default:
      return state
  }
}

export default settingsReducer
