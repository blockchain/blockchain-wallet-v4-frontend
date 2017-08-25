import * as AT from './actionTypes'

export const fetchSettings = (data) => ({ type: AT.FETCH_SETTINGS, payload: data })
export const fetchSettingsSuccess = (data) => ({ type: AT.FETCH_SETTINGS_SUCCESS, payload: data })
export const fetchSettingsError = (errorKey) => ({ type: AT.FETCH_SETTINGS_ERROR, payload: errorKey, error: true })

export const requestPairingCode = (guid, sharedKey) => ({ type: AT.REQUEST_PAIRING_CODE, payload: { guid, sharedKey } })
export const requestPairingCodeSuccess = (encryptionPhrase) => ({ type: AT.REQUEST_PAIRING_CODE_SUCCESS, payload: { encryptionPhrase } })
export const requestPairingCodeError = (message) => ({ type: AT.REQUEST_PAIRING_CODE_ERROR, payload: message })

export const updateEmail = email => ({ type: AT.UPDATE_EMAIL, payload: email })
export const updateEmailSuccess = data => ({ type: AT.UPDATE_EMAIL_SUCCESS, payload: data })
export const updateEmailError = message => ({ type: AT.UPDATE_EMAIL_ERROR, payload: message })

export const sendEmailConfirmation = email => ({ type: AT.SEND_EMAIL_CONFIRMATION, payload: { email } })
export const sendEmailConfirmationSuccess = data => ({ type: AT.SEND_EMAIL_CONFIRMATION_SUCCESS, payload: data })
export const sendEmailConfirmationError = message => ({ type: AT.SEND_EMAIL_CONFIRMATION_ERROR, payload: message })

export const verifyEmail = email => ({ type: AT.VERIFY_EMAIL, payload: { email } })
export const verifyEmailSuccess = data => ({ type: AT.VERIFY_EMAIL_SUCCESS, payload: data })
export const verifyEmailError = message => ({ type: AT.VERIFY_EMAIL_ERROR, payload: message })

export const updateMobile = mobile => ({ type: AT.UPDATE_MOBILE, payload: { mobile } })
export const updateMobileSuccess = data => ({ type: AT.UPDATE_MOBILE_SUCCESS, payload: data })
export const updateMobileError = message => ({ type: AT.UPDATE_MOBILE_ERROR, payload: message })

export const verifyMobile = mobile => ({ type: AT.VERIFY_MOBILE, payload: { mobile } })
export const verifyMobileSuccess = data => ({ type: AT.VERIFY_MOBILE_SUCCESS, payload: data })
export const verifyMobileError = message => ({ type: AT.VERIFY_MOBILE_ERROR, payload: message })
