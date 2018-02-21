import { concat, lift, head } from 'ramda'
import { selectors } from 'data'

export const getData = state => {
  const btcAccountsBalancesR = selectors.core.common.bitcoin.getAccountsBalances(state)
  const btcAddressesBalancesR = selectors.core.common.bitcoin.getAddressesBalances(state)
  const btcBalancesR = lift((btcAccounts, btcAddresses) => concat(btcAccounts, btcAddresses))(btcAccountsBalancesR, btcAddressesBalancesR)
  const ethBalancesR = selectors.core.common.ethereum.getAccountBalances(state)
  const btcFeeR = selectors.core.data.bitcoin.getFee(state)
  const ethFeeR = selectors.core.data.ethereum.getFee(state)
  const btcRatesR = selectors.core.data.bitcoin.getRates(state)
  const ethRatesR = selectors.core.data.ethereum.getRates(state)
  const btcUnitR = selectors.core.settings.getBtcUnit(state)
  const ethUnit = 'ETH'
  const currencyR = selectors.core.settings.getCurrency(state)

  const transform = (btcAccountsBalances, btcAddressesBalances, btcBalances, ethBalances, btcFee, ethFee, btcRates, ethRates, btcUnit, currency) => ({
    initialValues: { accounts: { source: head(btcAccountsBalances), target: head(ethBalances) }, amount: 0 },
    elements: [
      { group: 'Bitcoin', items: btcBalances.map(x => ({ text: x.label, value: x })) },
      { group: 'Ethereum', items: ethBalances.map(x => ({ text: x.label, value: x })) }
    ],
    btcBalances,
    ethBalances,
    btcFee,
    ethFee,
    btcRates,
    ethRates,
    btcUnit,
    ethUnit,
    currency
  })

  return lift(transform)(btcAccountsBalancesR, btcAddressesBalancesR, btcBalancesR, ethBalancesR, btcFeeR, ethFeeR, btcRatesR, ethRatesR, btcUnitR, currencyR)
}
