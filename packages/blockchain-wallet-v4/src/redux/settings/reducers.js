import * as AT from './actionTypes'

const INITIAL_STATE = {
  btc_unit: 'BTC',
  eth_unit: 'ETH',
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
    case AT.SET_SETTINGS: {
      const { data } = payload
      return data
    }
    case AT.SET_EMAIL: {
      const { email } = payload
      return Object.assign({}, state, { email: email, email_verified: 0 })
    }
    case AT.SET_EMAIL_VERIFIED: {
      return Object.assign({}, state, { email_verified: 1 })
    }
    case AT.SET_MOBILE: {
      const { mobile } = payload
      return Object.assign({}, state, { sms_number: mobile, sms_verified: 0 })
    }
    case AT.SET_MOBILE_VERIFIED: {
      return Object.assign({}, state, { sms_verified: 1 })
    }
    case AT.SET_LANGUAGE: {
      const { language } = payload
      return Object.assign({}, state, { language: language })
    }
    case AT.SET_CURRENCY: {
      const { currency } = payload
      return Object.assign({}, state, { currency: currency })
    }
    case AT.SET_BITCOIN_UNIT: {
      const { unit } = payload
      return Object.assign({}, state, { btc_unit: unit })
    }
    case AT.SET_AUTO_LOGOUT: {
      const { autoLogout } = payload
      return Object.assign({}, state, { auto_logout: autoLogout })
    }
    case AT.SET_LOGGING_LEVEL: {
      const { loggingLevel } = payload
      return Object.assign({}, state, { logging_level: loggingLevel })
    }
    case AT.SET_IP_LOCK: {
      const { ipLock } = payload
      if (ipLock === '') {
        return Object.assign({}, state, { ip_lock: ipLock, ip_lock_on: 0 })
      } else {
        return Object.assign({}, state, { ip_lock: ipLock })
      }
    }
    case AT.SET_IP_LOCK_ON: {
      const { ipLockOn } = payload
      return Object.assign({}, state, { ip_lock_on: ipLockOn })
    }
    case AT.SET_BLOCK_TOR_IPS: {
      const { blockTorIps } = payload
      return Object.assign({}, state, { block_tor_ips: blockTorIps })
    }
    case AT.SET_HINT: {
      const { hint } = payload
      return Object.assign({}, state, { password_hint1: hint })
    }
    case AT.SET_AUTH_TYPE: {
      const { authType } = payload
      return Object.assign({}, state, { auth_type: authType })
    }
    case AT.SET_AUTH_TYPE_NEVER_SAVE: {
      const { authTypeNeverSave } = payload
      return Object.assign({}, state, { never_save_auth_type: authTypeNeverSave })
    }
    case AT.SET_GOOGLE_AUTHENTICATOR: {
      return Object.assign({}, state, { auth_type: 4 })
    }
    case AT.SET_YUBIKEY: {
      return Object.assign({}, state, { auth_type: 2 })
    }
    default:
      return state
  }
}

export default settingsReducer
