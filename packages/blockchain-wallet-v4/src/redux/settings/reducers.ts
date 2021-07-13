import { assoc, compose } from 'ramda'

import Remote from '../../remote'
import * as AT from './actionTypes'

const INITIAL_STATE = Remote.NotAsked

const settingsReducer = (state = INITIAL_STATE, action) => {
  const { payload, type } = action

  switch (type) {
    case AT.SET_EMAIL: {
      const { email } = payload
      return state.map(
        compose(
          assoc('email', email),
          // @ts-ignore
          assoc('email_verified', 0)
        )
      )
    }
    case AT.SET_EMAIL_VERIFIED: {
      return state.map(
        compose(
          assoc('email_verified', 1),
          // @ts-ignore
          assoc('email_verified_failed', 0)
        )
      )
    }
    case AT.SET_EMAIL_VERIFIED_FAILED_STATUS: {
      const { isFailed } = payload
      return state.map(assoc('email_verified_failed', isFailed))
    }
    case AT.SET_MOBILE: {
      const { mobile } = payload
      return state.map(
        compose(
          assoc('sms_number', mobile),
          // @ts-ignore
          assoc('sms_verified', 0)
        )
      )
    }
    case AT.SET_MOBILE_VERIFIED: {
      return state.map(assoc('sms_verified', 1))
    }
    case AT.SET_LANGUAGE: {
      const { language } = payload
      return state.map(assoc('language', language))
    }
    case AT.SET_CURRENCY: {
      const { currency } = payload
      return state.map(assoc('currency', currency))
    }
    case AT.SET_AUTO_LOGOUT: {
      const { autoLogout } = payload
      return state.map(assoc('auto_logout', autoLogout))
    }
    case AT.SET_LOGGING_LEVEL: {
      const { loggingLevel } = payload
      return state.map(assoc('logging_level', loggingLevel))
    }
    case AT.SET_IP_LOCK: {
      const { ipLock } = payload
      if (ipLock === '') {
        return state.map(
          compose(
            assoc('ip_lock', ipLock),
            // @ts-ignore
            assoc('ip_lock_on', 0)
          )
        )
      } else {
        return state.map(assoc('ip_lock', ipLock))
      }
    }
    case AT.SET_IP_LOCK_ON: {
      const { ipLockOn } = payload
      return state.map(assoc('ip_lock_on', ipLockOn))
    }
    case AT.SET_BLOCK_TOR_IPS: {
      const { blockTorIps } = payload
      return state.map(assoc('block_tor_ips', blockTorIps))
    }
    case AT.SET_HINT: {
      const { hint } = payload
      return state.map(assoc('password_hint1', hint))
    }
    case AT.SET_AUTH_TYPE: {
      const { authType } = payload
      return state.map(assoc('auth_type', authType))
    }
    case AT.SET_AUTH_TYPE_NEVER_SAVE: {
      const { authTypeNeverSave } = payload
      return state.map(assoc('never_save_auth_type', authTypeNeverSave))
    }
    case AT.SET_GOOGLE_AUTHENTICATOR: {
      return state.map(assoc('auth_type', 4))
    }
    case AT.SET_YUBIKEY: {
      return state.map(assoc('auth_type', 2))
    }
    case AT.FETCH_SETTINGS_LOADING: {
      return Remote.Loading
    }
    case AT.FETCH_SETTINGS_SUCCESS: {
      return Remote.Success(payload)
    }
    case AT.FETCH_SETTINGS_FAILURE: {
      return Remote.Failure(payload)
    }
    case AT.SET_GOOGLE_AUTHENTICATOR_SECRET_URL: {
      const { url } = payload
      return state.map(assoc('google_authenticator_secret_url', url))
    }
    case AT.SET_NOTIFICATIONS_ON: {
      const { enabled } = payload
      return state.map(assoc('notifications_on', enabled))
    }
    case AT.SET_NOTIFICATIONS_TYPE: {
      const { types } = payload
      return state.map(assoc('notifications_type', types))
    }
    default:
      return state
  }
}

export default settingsReducer
