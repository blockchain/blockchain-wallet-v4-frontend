import * as T from './actionTypes'

export const fetchSettings = (data) =>
  ({ type: T.FETCH_SETTINGS, payload: data })
export const fetchSettingsSuccess = (data) =>
  ({ type: T.FETCH_SETTINGS_SUCCESS, payload: data })
export const fetchSettingsError = (errorKey) =>
  ({ type: T.FETCH_SETTINGS_ERROR, payload: errorKey, error: true })
