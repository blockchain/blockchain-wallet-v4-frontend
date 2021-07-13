import * as AT from './actionTypes'

export const decodePairingCode = (data) => ({
  payload: { data },
  type: AT.DECODE_PAIRING_CODE
})
export const requestGoogleAuthenticatorSecretUrl = () => ({
  type: AT.REQUEST_GOOGLE_AUTHENTICATOR_SECRET_URL
})
// SETTERS
export const setGoogleAuthenticatorSecretUrl = (url) => ({
  payload: { url },
  type: AT.SET_GOOGLE_AUTHENTICATOR_SECRET_URL
})
export const setSettings = (data) => ({
  payload: { data },
  type: AT.SET_SETTINGS
})
export const setEmail = (email) => ({ payload: { email }, type: AT.SET_EMAIL })
export const sentConfirmationCodeSuccess = (email) => ({
  payload: { email },
  type: AT.SENT_CONFIRMATION_CODE_SUCCESS
})
export const verifyEmailCodeSuccess = (code) => ({
  payload: { code },
  type: AT.VERIFY_EMAIL_CODE_SUCCESS
})
export const setEmailVerified = () => ({ type: AT.SET_EMAIL_VERIFIED })
export const setEmailVerifiedFailedStatus = (isFailed) => ({
  payload: { isFailed },
  type: AT.SET_EMAIL_VERIFIED_FAILED_STATUS
})
export const setMobile = (mobile) => ({
  payload: { mobile },
  type: AT.SET_MOBILE
})
export const setMobileVerified = () => ({ type: AT.SET_MOBILE_VERIFIED })
export const setLanguage = (language) => ({
  payload: { language },
  type: AT.SET_LANGUAGE
})
export const setCurrency = (currency) => ({
  payload: { currency },
  type: AT.SET_CURRENCY
})
export const setAutoLogout = (autoLogout) => ({
  payload: { autoLogout },
  type: AT.SET_AUTO_LOGOUT
})
export const setLoggingLevel = (loggingLevel) => ({
  payload: { loggingLevel },
  type: AT.SET_LOGGING_LEVEL
})
export const setIpLock = (ipLock) => ({
  payload: { ipLock },
  type: AT.SET_IP_LOCK
})
export const setIpLockOn = (ipLockOn) => ({
  payload: { ipLockOn },
  type: AT.SET_IP_LOCK_ON
})
export const setBlockTorIps = (blockTorIps) => ({
  payload: { blockTorIps },
  type: AT.SET_BLOCK_TOR_IPS
})
export const setHint = (hint) => ({ payload: { hint }, type: AT.SET_HINT })
export const setAuthType = (authType) => ({
  payload: { authType },
  type: AT.SET_AUTH_TYPE
})
export const setAuthTypeNeverSave = (authTypeNeverSave) => ({
  payload: { authTypeNeverSave },
  type: AT.SET_AUTH_TYPE_NEVER_SAVE
})
export const setGoogleAuthenticator = () => ({
  type: AT.SET_GOOGLE_AUTHENTICATOR
})
export const setYubikey = () => ({ type: AT.SET_YUBIKEY })
export const setNotificationsOn = (enabled) => ({
  payload: { enabled },
  type: AT.SET_NOTIFICATIONS_ON
})
export const setNotificationsType = (types) => ({
  payload: { types },
  type: AT.SET_NOTIFICATIONS_TYPE
})

// FETCH_SETTINGS
export const fetchSettings = () => ({ type: AT.FETCH_SETTINGS })
export const fetchSettingsLoading = () => ({ type: AT.FETCH_SETTINGS_LOADING })
export const fetchSettingsSuccess = (data) => ({
  payload: data,
  type: AT.FETCH_SETTINGS_SUCCESS
})
export const fetchSettingsFailure = (error) => ({
  payload: error,
  type: AT.FETCH_SETTINGS_FAILURE
})
