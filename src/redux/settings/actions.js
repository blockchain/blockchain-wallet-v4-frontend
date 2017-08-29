import * as AT from './actionTypes'

export const fetchSettings = (data) => ({ type: AT.FETCH_SETTINGS, payload: data })
export const fetchSettingsSuccess = (data) => ({ type: AT.FETCH_SETTINGS_SUCCESS, payload: data })
export const fetchSettingsError = (errorKey) => ({ type: AT.FETCH_SETTINGS_ERROR, payload: errorKey, error: true })

export const requestPairingCode = (guid, sharedKey) => ({ type: AT.REQUEST_PAIRING_CODE, payload: { guid, sharedKey } })
export const requestPairingCodeSuccess = (encryptionPhrase) => ({ type: AT.REQUEST_PAIRING_CODE_SUCCESS, payload: { encryptionPhrase } })
export const requestPairingCodeError = (message) => ({ type: AT.REQUEST_PAIRING_CODE_ERROR, payload: message })

export const updateEmail = (guid, sharedKey, email) => ({ type: AT.UPDATE_EMAIL, payload: { guid, sharedKey, email } })
export const updateEmailSuccess = data => ({ type: AT.UPDATE_EMAIL_SUCCESS, payload: data })
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
