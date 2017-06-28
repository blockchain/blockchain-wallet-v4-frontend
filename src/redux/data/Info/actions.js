import * as T from './actionTypes'

export const loadInfoData = (data) =>
  ({ type: T.INFO_DATA_LOAD, payload: data })
