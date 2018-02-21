import { concat, lift } from 'ramda'
import { selectors } from 'data'

export const getData = state => {
  const btcAccountsBalancesR = selectors.core.common.bitcoin.getAccountsBalances(state)
  const btcAddressesBalancesR = selectors.core.common.bitcoin.getAddressesBalances(state)
  const btcBalancesR = lift((btcAccounts, btcAddresses) => concat(btcAccounts, btcAddresses))(btcAccountsBalancesR, btcAddressesBalancesR)
  const ethBalancesR = selectors.core.common.ethereum.getAccountBalances(state)

  const transform = (btcBalances, ethBalances) => ({
    elements: [
      { group: 'Bitcoin', items: btcBalances.map(x => ({ text: x.label, value: x })) },
      { group: 'Ethereum', items: ethBalances.map(x => ({ text: x.label, value: x })) }
    ],
    btcBalances,
    ethBalances
  })

  return lift(transform)(btcBalancesR, ethBalancesR)
}
