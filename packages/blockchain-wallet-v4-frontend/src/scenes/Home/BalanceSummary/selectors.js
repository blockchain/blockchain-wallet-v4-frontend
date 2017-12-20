import { add, compose, map, reduce, prop } from 'ramda'
import { selectors } from 'data'

export const getData = (state) => {
  const accountsBalances = selectors.core.common.bitcoin.getAccountsBalances(state)
  const importedAddressesBalance = selectors.core.common.bitcoin.getAggregatedAddressesBalances(state)
  console.log(accountsBalances)
  console.log(importedAddressesBalance)
  const bitcoinBalances = [...accountsBalances, importedAddressesBalance]
  const getTotalBalance = compose(reduce(add, 0), map(value => prop('amount', value)))

  return {
    value: {
      bitcoinBalances,
      total: map(getTotalBalance, bitcoinBalances)
    }
  }
}
