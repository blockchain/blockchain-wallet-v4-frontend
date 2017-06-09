export const ADDRESSES_DATA_LOAD = '@v3.ADDRESSES_DATA_LOAD'

export const loadAddressesData = (data) =>
  ({ type: ADDRESSES_DATA_LOAD, payload: data })
