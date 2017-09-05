import * as T from './actionTypes'

export const fetchSettings = (data) => ({ type: T.FETCH_SETTINGS, payload: data })
export const fetchSettingsSuccess = (data) => ({ type: T.FETCH_SETTINGS_SUCCESS, payload: data })
export const fetchSettingsError = (errorKey) => ({ type: T.FETCH_SETTINGS_ERROR, payload: errorKey, error: true })

export const requestPairingCode = (guid, sharedKey) => ({ type: T.REQUEST_PAIRING_CODE, payload: { guid, sharedKey } })
export const requestPairingCodeSuccess = (encryptionPhrase) => ({ type: T.REQUEST_PAIRING_CODE_SUCCESS, payload: { encryptionPhrase } })
export const requestPairingCodeError = (message) => ({ type: T.REQUEST_PAIRING_CODE_ERROR, payload: message })
