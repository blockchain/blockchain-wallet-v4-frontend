import * as T from './actionTypes'

export const loadAddressesData = (data) =>
  ({ type: T.ADDRESSES_DATA_LOAD, payload: data })
