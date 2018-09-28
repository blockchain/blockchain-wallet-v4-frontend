import * as AT from './actionTypes'

export const decodePairingCode = data => ({
  type: AT.DECODE_PAIRING_CODE,
  payload: { data }
})
export const requestGoogleAuthenticatorSecretUrl = () => ({
  type: AT.REQUEST_GOOGLE_AUTHENTICATOR_SECRET_URL
})
// SETTERS
export const setGoogleAuthenticatorSecretUrl = url => ({
  type: AT.SET_GOOGLE_AUTHENTICATOR_SECRET_URL,
  payload: { url }
})
export const setSettings = data => ({
  type: AT.SET_SETTINGS,
  payload: { data }
})
export const setEmail = email => ({ type: AT.SET_EMAIL, payload: { email } })
export const sentConfirmationCodeSuccess = email => ({
  type: AT.SENT_CONFIRMATION_CODE_SUCCESS,
  payload: { email }
})
export const verifyEmailCodeSuccess = code => ({
  type: AT.VERIFY_EMAIL_CODE_SUCCESS,
  payload: { code }
})
export const setEmailVerified = () => ({ type: AT.SET_EMAIL_VERIFIED })
export const setEmailVerifiedFailedStatus = isFailed => ({
  type: AT.SET_EMAIL_VERIFIED_FAILED_STATUS,
  payload: { isFailed }
})
export const setMobile = mobile => ({
  type: AT.SET_MOBILE,
  payload: { mobile }
})
export const setMobileVerified = () => ({ type: AT.SET_MOBILE_VERIFIED })
export const setLanguage = language => ({
  type: AT.SET_LANGUAGE,
  payload: { language }
})
export const setCurrency = currency => ({
  type: AT.SET_CURRENCY,
  payload: { currency }
})
export const setAutoLogout = autoLogout => ({
  type: AT.SET_AUTO_LOGOUT,
  payload: { autoLogout }
})
export const setLoggingLevel = loggingLevel => ({
  type: AT.SET_LOGGING_LEVEL,
  payload: { loggingLevel }
})
export const setIpLock = ipLock => ({
  type: AT.SET_IP_LOCK,
  payload: { ipLock }
})
export const setIpLockOn = ipLockOn => ({
  type: AT.SET_IP_LOCK_ON,
  payload: { ipLockOn }
})
export const setBlockTorIps = blockTorIps => ({
  type: AT.SET_BLOCK_TOR_IPS,
  payload: { blockTorIps }
})
export const setHint = hint => ({ type: AT.SET_HINT, payload: { hint } })
export const setAuthType = authType => ({
  type: AT.SET_AUTH_TYPE,
  payload: { authType }
})
export const setAuthTypeNeverSave = authTypeNeverSave => ({
  type: AT.SET_AUTH_TYPE_NEVER_SAVE,
  payload: { authTypeNeverSave }
})
export const setGoogleAuthenticator = () => ({
  type: AT.SET_GOOGLE_AUTHENTICATOR
})
export const setYubikey = () => ({ type: AT.SET_YUBIKEY })
export const setNotificationsOn = enabled => ({
  type: AT.SET_NOTIFICATIONS_ON,
  payload: { enabled }
})
export const setNotificationsType = types => ({
  type: AT.SET_NOTIFICATIONS_TYPE,
  payload: { types }
})

// FETCH_SETTINGS
export const fetchSettings = () => ({ type: AT.FETCH_SETTINGS })
export const fetchSettingsLoading = () => ({ type: AT.FETCH_SETTINGS_LOADING })
export const fetchSettingsSuccess = data => ({
  type: AT.FETCH_SETTINGS_SUCCESS,
  payload: data
})
export const fetchSettingsFailure = error => ({
  type: AT.FETCH_SETTINGS_FAILURE,
  payload: error
})
