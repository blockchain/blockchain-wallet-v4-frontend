import * as AT from './actionTypes'

export const fetchSettings = (data) => ({ type: AT.FETCH_SETTINGS, payload: data })
export const fetchSettingsSuccess = (data) => ({ type: AT.FETCH_SETTINGS_SUCCESS, payload: data })
export const fetchSettingsError = (errorKey) => ({ type: AT.FETCH_SETTINGS_ERROR, payload: errorKey, error: true })

export const requestPairingCode = (guid, sharedKey, password) => ({ type: AT.REQUEST_PAIRING_CODE, payload: { guid, sharedKey, password } })
export const requestPairingCodeSuccess = (encryptionPhrase) => ({ type: AT.REQUEST_PAIRING_CODE_SUCCESS, payload: { encryptionPhrase } })
export const requestPairingCodeError = (message) => ({ type: AT.REQUEST_PAIRING_CODE_ERROR, payload: message })

export const updateEmail = (guid, sharedKey, email) => ({ type: AT.UPDATE_EMAIL, payload: { guid, sharedKey, email } })
export const updateEmailSuccess = (email, data) => ({ type: AT.UPDATE_EMAIL_SUCCESS, payload: { email, data } })
export const updateEmailError = message => ({ type: AT.UPDATE_EMAIL_ERROR, payload: message })

export const sendEmailConfirmation = (guid, sharedKey, email) => ({ type: AT.SEND_EMAIL_CONFIRMATION, payload: { guid, sharedKey, email } })
export const sendEmailConfirmationSuccess = (email, data) => ({ type: AT.SEND_EMAIL_CONFIRMATION_SUCCESS, payload: { email, data } })
export const sendEmailConfirmationError = message => ({ type: AT.SEND_EMAIL_CONFIRMATION_ERROR, payload: message })

export const verifyEmail = (guid, sharedKey, code) => ({ type: AT.VERIFY_EMAIL, payload: { guid, sharedKey, code } })
export const verifyEmailSuccess = (code, data) => ({ type: AT.VERIFY_EMAIL_SUCCESS, payload: { code, data } })
export const verifyEmailError = message => ({ type: AT.VERIFY_EMAIL_ERROR, payload: message })

export const updateMobile = (guid, sharedKey, mobile) => ({ type: AT.UPDATE_MOBILE, payload: { guid, sharedKey, mobile } })
export const updateMobileSuccess = (mobile, data) => ({ type: AT.UPDATE_MOBILE_SUCCESS, payload: { mobile, data } })
export const updateMobileError = message => ({ type: AT.UPDATE_MOBILE_ERROR, payload: message })

export const verifyMobile = (guid, sharedKey, code) => ({ type: AT.VERIFY_MOBILE, payload: { guid, sharedKey, code } })
export const verifyMobileSuccess = (code, data) => ({ type: AT.VERIFY_MOBILE_SUCCESS, payload: { code, data } })
export const verifyMobileError = message => ({ type: AT.VERIFY_MOBILE_ERROR, payload: message })

export const updateLanguage = (guid, sharedKey, language) => ({ type: AT.UPDATE_LANGUAGE, payload: { guid, sharedKey, language } })
export const updateLanguageSuccess = (language, data) => ({ type: AT.UPDATE_LANGUAGE_SUCCESS, payload: { language, data } })
export const updateLanguageError = message => ({ type: AT.UPDATE_LANGUAGE_ERROR, payload: message })

export const updateCurrency = (guid, sharedKey, currency) => ({ type: AT.UPDATE_CURRENCY, payload: { guid, sharedKey, currency } })
export const updateCurrencySuccess = (currency, data) => ({ type: AT.UPDATE_CURRENCY_SUCCESS, payload: { currency, data } })
export const updateCurrencyError = message => ({ type: AT.UPDATE_CURRENCY_ERROR, payload: message })

export const updateBitcoinUnit = (guid, sharedKey, unit) => ({ type: AT.UPDATE_BITCOIN_UNIT, payload: { guid, sharedKey, unit } })
export const updateBitcoinUnitSuccess = (unit, data) => ({ type: AT.UPDATE_BITCOIN_UNIT_SUCCESS, payload: { unit, data } })
export const updateBitcoinUnitError = message => ({ type: AT.UPDATE_BITCOIN_UNIT_ERROR, payload: message })

export const updateAutoLogout = (guid, sharedKey, autoLogout) => ({ type: AT.UPDATE_AUTO_LOGOUT, payload: { guid, sharedKey, autoLogout } })
export const updateAutoLogoutSuccess = (autoLogout, data) => ({ type: AT.UPDATE_AUTO_LOGOUT_SUCCESS, payload: { autoLogout, data } })
export const updateAutoLogoutError = message => ({ type: AT.UPDATE_AUTO_LOGOUT_ERROR, payload: message })

export const updateLoggingLevel = (guid, sharedKey, loggingLevel) => ({ type: AT.UPDATE_LOGGING_LEVEL, payload: { guid, sharedKey, loggingLevel } })
export const updateLoggingLevelSuccess = (loggingLevel, data) => ({ type: AT.UPDATE_LOGGING_LEVEL_SUCCESS, payload: { loggingLevel, data } })
export const updateLoggingLevelError = message => ({ type: AT.UPDATE_LOGGING_LEVEL_ERROR, payload: message })

export const updateIpLock = (guid, sharedKey, ipLock) => ({ type: AT.UPDATE_IP_LOCK, payload: { guid, sharedKey, ipLock } })
export const updateIpLockSuccess = (ipLock, data) => ({ type: AT.UPDATE_IP_LOCK_SUCCESS, payload: { ipLock, data } })
export const updateIpLockError = message => ({ type: AT.UPDATE_IP_LOCK_ERROR, payload: message })

export const updateIpLockOn = (guid, sharedKey, ipLockOn) => ({ type: AT.UPDATE_IP_LOCK_ON, payload: { guid, sharedKey, ipLockOn } })
export const updateIpLockOnSuccess = (ipLockOn, data) => ({ type: AT.UPDATE_IP_LOCK_ON_SUCCESS, payload: { ipLockOn, data } })
export const updateIpLockOnError = message => ({ type: AT.UPDATE_IP_LOCK_ON_ERROR, payload: message })

export const updateBlockTorIps = (guid, sharedKey, blockTorIps) => ({ type: AT.UPDATE_BLOCK_TOR_IPS, payload: { guid, sharedKey, blockTorIps } })
export const updateBlockTorIpsSuccess = (blockTorIps, data) => ({ type: AT.UPDATE_BLOCK_TOR_IPS_SUCCESS, payload: { blockTorIps, data } })
export const updateBlockTorIpsError = message => ({ type: AT.UPDATE_BLOCK_TOR_IPS_ERROR, payload: message })

export const updateHint = (guid, sharedKey, hint) => ({ type: AT.UPDATE_HINT, payload: { guid, sharedKey, hint } })
export const updateHintSuccess = (hint, data) => ({ type: AT.UPDATE_HINT_SUCCESS, payload: { hint, data } })
export const updateHintError = message => ({ type: AT.UPDATE_HINT_ERROR, payload: message })

export const updateAuthType = (guid, sharedKey, authType) => ({ type: AT.UPDATE_AUTH_TYPE, payload: { guid, sharedKey, authType } })
export const updateAuthTypeSuccess = (authType, data) => ({ type: AT.UPDATE_AUTH_TYPE_SUCCESS, payload: { authType, data } })
export const updateAuthTypeError = message => ({ type: AT.UPDATE_AUTH_TYPE_ERROR, payload: message })

export const updateAuthTypeNeverSave = (guid, sharedKey, authTypeNeverSave) => ({ type: AT.UPDATE_AUTH_TYPE_NEVER_SAVE, payload: { guid, sharedKey, authTypeNeverSave } })
export const updateAuthTypeNeverSaveSuccess = (authTypeNeverSave, data) => ({ type: AT.UPDATE_AUTH_TYPE_NEVER_SAVE_SUCCESS, payload: { authTypeNeverSave, data } })
export const updateAuthTypeNeverSaveError = message => ({ type: AT.UPDATE_AUTH_TYPE_NEVER_SAVE_ERROR, payload: message })

export const getGoogleAuthenticatorSecretUrl = (guid, sharedKey) => ({ type: AT.GET_GOOGLE_AUTHENTICATOR_SECRET_URL, payload: { guid, sharedKey } })
export const getGoogleAuthenticatorSecretUrlSuccess = data => ({ type: AT.GET_GOOGLE_AUTHENTICATOR_SECRET_URL_SUCCESS, payload: { data } })
export const getGoogleAuthenticatorSecretUrlError = message => ({ type: AT.GET_GOOGLE_AUTHENTICATOR_SECRET_URL_ERROR, payload: message })

export const confirmGoogleAuthenticatorSetup = (guid, sharedKey, code) => ({ type: AT.CONFIRM_GOOGLE_AUTHENTICATOR_SETUP, payload: { guid, sharedKey, code } })
export const confirmGoogleAuthenticatorSetupSuccess = data => ({ type: AT.CONFIRM_GOOGLE_AUTHENTICATOR_SETUP_SUCCESS, payload: { data } })
export const confirmGoogleAuthenticatorSetupError = message => ({ type: AT.CONFIRM_GOOGLE_AUTHENTICATOR_SETUP_ERROR, payload: message })

export const enableYubikey = (guid, sharedKey, code) => ({ type: AT.ENABLE_YUBIKEY, payload: { guid, sharedKey, code } })
export const enableYubikeySuccess = data => ({ type: AT.ENABLE_YUBIKEY_SUCCESS, payload: { data } })
export const enableYubikeyError = message => ({ type: AT.ENABLE_YUBIKEY_ERROR, payload: message })
