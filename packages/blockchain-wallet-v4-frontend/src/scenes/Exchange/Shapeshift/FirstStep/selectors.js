import { concat, lift, head, prop } from 'ramda'
import { selectors } from 'data'
import { formValueSelector } from 'redux-form'

export const getData = state => {
  const btcAccountsBalancesR = selectors.core.common.bitcoin.getAccountsBalances(state)
  const btcAddressesBalancesR = selectors.core.common.bitcoin.getAddressesBalances(state)
  const btcBalancesR = lift((btcAccounts, btcAddresses) => concat(btcAccounts, btcAddresses))(btcAccountsBalancesR, btcAddressesBalancesR)
  const ethBalancesR = selectors.core.common.ethereum.getAccountBalances(state)
  const btcFeeR = selectors.core.data.bitcoin.getFee(state)
  const ethFeeR = selectors.core.data.ethereum.getFee(state)

  const transform = (btcAccountsBalances, btcAddressesBalances, btcBalances, ethBalances, btcFee, ethFee) => {
    const initialValues = { source: head(btcAccountsBalances), target: head(ethBalances), amount: 0 }
    const source = formValueSelector('exchange')(state, 'source')
    const target = formValueSelector('exchange')(state, 'target')
    const amount = formValueSelector('exchange')(state, 'amount')
    const sourceCoin = prop('coin', source) || prop('coin', initialValues.source)
    const targetCoin = prop('coin', target) || prop('coin', initialValues.target)
    return {
      initialValues,
      elements: [
        { group: 'Bitcoin', items: btcBalances.map(x => ({ text: x.label, value: x })) },
        { group: 'Ethereum', items: ethBalances.map(x => ({ text: x.label, value: x })) }
      ],
      btcBalances,
      ethBalances,
      btcFee,
      ethFee,
      source,
      target,
      amount,
      sourceCoin,
      targetCoin
    }
  }

  return lift(transform)(btcAccountsBalancesR, btcAddressesBalancesR, btcBalancesR, ethBalancesR, btcFeeR, ethFeeR)
}

// const btcFeeR = selectors.core.data.bitcoin.getFee(state)
// const ethFeeR = selectors.core.data.ethereum.getFee(state)
// const coinsR = selectors.core.data.bitcoin.getCoins(state)
