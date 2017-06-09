export const INFO_DATA_LOAD = '@v3.INFO_DATA_LOAD'

export const loadInfoData = (data) =>
  ({ type: INFO_DATA_LOAD, payload: data })
