export const SETTINGS_DATA_REQUEST = '@v3.SETTINGS_DATA_REQUEST'
export const SETTINGS_DATA_LOAD = '@v3.SETTINGS_DATA_LOAD'

export const requestSettingsData = (data) =>
  ({ type: SETTINGS_DATA_REQUEST, payload: data })

export const loadSettingsData = (data) =>
  ({ type: SETTINGS_DATA_LOAD, payload: data })
