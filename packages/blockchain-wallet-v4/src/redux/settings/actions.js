import * as AT from './actionTypes'

export const encodePairingCode = () => ({ type: AT.ENCODE_PAIRING_CODE })

export const decodePairingCode = (data) => ({ type: AT.DECODE_PAIRING_CODE, payload: { data } })

export const requestGoogleAuthenticatorSecretUrl = () => ({ type: AT.REQUEST_GOOGLE_AUTHENTICATOR_SECRET_URL })

// SETTERS
export const setSettings = (data) => ({ type: AT.SET_SETTINGS, payload: { data } })

export const setEmail = (email) => ({ type: AT.SET_EMAIL, payload: { email } })

export const setEmailVerified = () => ({ type: AT.SET_EMAIL_VERIFIED })

export const setMobile = (mobile) => ({ type: AT.SET_MOBILE, payload: { mobile } })

export const setMobileVerified = () => ({ type: AT.SET_MOBILE_VERIFIED })

export const setLanguage = (language) => ({ type: AT.SET_LANGUAGE, payload: { language } })

export const setCurrency = (currency) => ({ type: AT.SET_CURRENCY, payload: { currency } })

export const setBitcoinUnit = (unit) => ({ type: AT.SET_BITCOIN_UNIT, payload: { unit } })

export const setAutoLogout = (autoLogout) => ({ type: AT.SET_AUTO_LOGOUT, payload: { autoLogout } })

export const setLoggingLevel = (loggingLevel) => ({ type: AT.SET_LOGGING_LEVEL, payload: { loggingLevel } })

export const setIpLock = (ipLock) => ({ type: AT.SET_IP_LOCK, payload: { ipLock } })

export const setIpLockOn = (ipLockOn) => ({ type: AT.SET_IP_LOCK_ON, payload: { ipLockOn } })

export const setBlockTorIps = (blockTorIps) => ({ type: AT.SET_BLOCK_TOR_IPS, payload: { blockTorIps } })

export const setHint = (hint) => ({ type: AT.SET_HINT, payload: { hint } })

export const setAuthType = (authType) => ({ type: AT.SET_AUTH_TYPE, payload: { authType } })

export const setAuthTypeNeverSave = (authTypeNeverSave) => ({ type: AT.SET_AUTH_TYPE_NEVER_SAVE, payload: { authTypeNeverSave } })

export const setGoogleAuthenticator = () => ({ type: AT.SET_GOOGLE_AUTHENTICATOR })

export const setYubikey = () => ({ type: AT.SET_YUBIKEY })
