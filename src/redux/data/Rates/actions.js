import * as T from './actionTypes'

export const loadRatesData = (data) =>
  ({ type: T.RATES_DATA_LOAD, payload: data })
