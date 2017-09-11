import * as AT from './actionTypes'

export const fetchSettings = (data) => ({ type: AT.FETCH_SETTINGS, payload: data })
export const fetchSettingsSuccess = (data) => ({ type: AT.FETCH_SETTINGS_SUCCESS, payload: data })
export const fetchSettingsError = (errorKey) => ({ type: AT.FETCH_SETTINGS_ERROR, payload: errorKey, error: true })

export const requestPairingCode = (guid, sharedKey) => ({ type: AT.REQUEST_PAIRING_CODE, payload: { guid, sharedKey } })
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

export const updateHint = (guid, sharedKey, hint) => ({ type: AT.UPDATE_HINT, payload: { guid, sharedKey, hint } })
export const updateHintSuccess = (hint, data) => ({ type: AT.UPDATE_HINT_SUCCESS, payload: { hint, data } })
export const updateHintError = message => ({ type: AT.UPDATE_HINT_ERROR, payload: message })
