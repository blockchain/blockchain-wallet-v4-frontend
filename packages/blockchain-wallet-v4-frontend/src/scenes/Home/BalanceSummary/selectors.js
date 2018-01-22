import { add, compose, map, mapAccum, reduce, prop } from 'ramda'
import { selectors } from 'data'

export const getData = (state) => {
  // const bitcoinAddressesData = selectors.core.data.bitcoin.getAddresses(state)
  // const bitcoinLegacyAddresses = selectors.core.wallet.getAddresses(state)
  // const bitcoinHDAccounts = selectors.core.common.bitcoin.getAccountsBalances(state)

  return {
    value: 'test'
  }
}
