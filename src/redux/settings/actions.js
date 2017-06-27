import * as T from './actionTypes'

export const requestSettingsData = (data) =>
  ({ type: T.SETTINGS_DATA_REQUEST, payload: data })

export const loadSettingsData = (data) =>
  ({ type: T.SETTINGS_DATA_LOAD, payload: data })
