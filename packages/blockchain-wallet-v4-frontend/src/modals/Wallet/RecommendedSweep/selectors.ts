import { head, lift, prop, propOr } from 'ramda'

import { selectors } from 'data'

// @ts-ignore
const extractAddress = (addr) => prop('addr', head(addr))

export const getData = (state) => {
  const addressesR = selectors.core.common.btc.getActiveAddresses(state)
  const defaultAccountR = selectors.core.common.btc.getDefaultAccount(state)

  const transform = (addresses, defaultAccount) => ({
    addresses,
    defaultAccount
    // ethAddr,
    // ethBalance: propOr('0', 'effectiveBalance', payment) as string,
    // txFee: propOr('0', 'fee', payment) as string
  })

  return lift(transform)(addressesR, defaultAccountR)
}
