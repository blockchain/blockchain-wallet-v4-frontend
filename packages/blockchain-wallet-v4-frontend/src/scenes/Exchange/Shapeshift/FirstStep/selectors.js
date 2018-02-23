import { concat, lift, head, mergeAll } from 'ramda'
import { selectors } from 'data'

export const getBitcoinData = state => {
  const btcFeeR = selectors.core.data.bitcoin.getFee(state)
  const btcRatesR = selectors.core.data.bitcoin.getRates(state)
  const btcEthR = selectors.core.data.shapeShift.getBtcEth(state)

  const transform = (btcFee, btcRates, btcEth) => ({ btcFee, btcRates, btcEth })

  return lift(transform)(btcFeeR, btcRatesR, btcEthR)
}

export const getEthereumData = state => {
  const ethFeeR = selectors.core.data.ethereum.getFee(state)
  const ethRatesR = selectors.core.data.ethereum.getRates(state)
  const ethBtcR = selectors.core.data.shapeShift.getEthBtc(state)

  const transform = (ethFee, ethRates, ethBtc) => ({ ethFee, ethRates, ethBtc })

  return lift(transform)(ethFeeR, ethRatesR, ethBtcR)
}

export const getCommonData = state => {
  const btcAccountsBalancesR = selectors.core.common.bitcoin.getAccountsBalances(state)
  const btcAddressesBalancesR = selectors.core.common.bitcoin.getAddressesBalances(state)
  const btcBalancesR = lift((btcAccounts, btcAddresses) => concat(btcAccounts, btcAddresses))(btcAccountsBalancesR, btcAddressesBalancesR)
  const ethBalancesR = selectors.core.common.ethereum.getAccountBalances(state)
  const currencyR = selectors.core.settings.getCurrency(state)

  const transform = (btcAccountsBalances, btcAddressesBalances, btcBalances, ethBalances, currency) => ({
    initialValues: {
      accounts: { source: head(btcAccountsBalances), target: head(ethBalances) },
      amount: { source: 0, target: 0 }
    },
    elements: [
      { group: 'Bitcoin', items: btcBalances.map(x => ({ text: x.label, value: x })) },
      { group: 'Ethereum', items: ethBalances.map(x => ({ text: x.label, value: x })) }
    ],
    btcBalances,
    ethBalances,
    currency
  })

  return lift(transform)(btcAccountsBalancesR, btcAddressesBalancesR, btcBalancesR, ethBalancesR, currencyR)
}

export const getData = state => lift((a, b, c) => mergeAll([a, b, c]))(getCommonData(state), getBitcoinData(state), getEthereumData(state))
