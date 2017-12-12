import * as selectors from './../../selectors'

export const getBalanceSummaryData = (state) => {
  let accountsBalances = selectors.core.common.bitcoin.getAccountsBalances(state)
  let importedAddressesBalance = selectors.core.common.bitcoin.getAggregatedAddressesBalances(state)
  return {
    bitcoinBalances: [...accountsBalances, importedAddressesBalance]
  }
}
