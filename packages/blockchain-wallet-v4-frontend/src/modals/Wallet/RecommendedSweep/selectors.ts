import { head, lift, prop, propOr } from 'ramda'

import { selectors } from 'data'

// @ts-ignore
const extractAddress = (addr) => prop('addr', head(addr))

export const getData = (state) => {
  const addressesR = selectors.core.common.btc.getActiveAddresses(state) as object[]

  const transform = (addresses) => ({
    addresses
  })

  return lift(transform)(addressesR)
}
