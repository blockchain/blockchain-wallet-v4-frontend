import { concat, lift, head } from 'ramda'
import { selectors } from 'data'
import { formValueSelector } from 'redux-form'

export const getData = state => {
  const bitcoinAccountsBalancesR = selectors.core.common.bitcoin.getAccountsBalances(state)
  const bitcoinAddressesBalancesR = selectors.core.common.bitcoin.getAddressesBalances(state)
  const bitcoinBalancesR = lift((btcAccounts, btcAddresses) => concat(btcAccounts, btcAddresses))(bitcoinAccountsBalancesR, bitcoinAddressesBalancesR)
  const ethereumBalancesR = selectors.core.common.ethereum.getAccountBalances(state)

  const transform = (bitcoinAccountsBalances, bitcoinAddressesBalances, bitcoinBalances, ethereumBalances) => {
    const defaultBitcoinAccount = head(bitcoinAccountsBalances)
    const defaultEthereumAccount = head(ethereumBalances)

    return {
      initialValues: { source: defaultBitcoinAccount, target: defaultEthereumAccount, amount: 1 },
      elements: [{
        group: 'Bitcoin',
        items: bitcoinBalances.map(x => ({ text: x.label, value: x }))
      }, {
        group: 'Ethereum',
        items: ethereumBalances.map(x => ({ text: x.label, value: x }))
      }],
      bitcoinBalances,
      ethereumBalances,
      source: formValueSelector('exchange')(state, 'source'),
      target: formValueSelector('exchange')(state, 'target'),
      amount: formValueSelector('exchange')(state, 'amount')
    }
  }

  return lift(transform)(bitcoinAccountsBalancesR, bitcoinAddressesBalancesR, bitcoinBalancesR, ethereumBalancesR)
}
