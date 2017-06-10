export const RATES_DATA_LOAD = '@v3.RATES_DATA_LOAD'

export const loadRatesData = (data) =>
  ({ type: RATES_DATA_LOAD, payload: data })