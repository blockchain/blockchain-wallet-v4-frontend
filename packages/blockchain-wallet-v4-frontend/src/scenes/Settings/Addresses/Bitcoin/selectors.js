import { lift, map } from 'ramda'
import { selectors } from 'data'

// export const getData = (state) => {
//   const settings = selectors.core.settings.getSettings(state)
//   const rates = selectors.core.data.bitcoin.getRates(state)
//   const transform = (settings, rates) => Exchange.displayBitcoinToFiat({ value: 1, fromUnit: 'BTC', toCurrency: settings.currency, rates })
//   return lift(transform)(settings, rates)
// }

export const getData = state => {
  const accounts = map(x => ({ label: x.label, value: x }))
  const wallets = selectors.core.common.bitcoin.getAccountsBalances(state).map(accounts)
  const importedAddresses = selectors.core.common.bitcoin.getActiveAddresses(state)
  return lift((wallets, importedAddresses) => ({ wallets, importedAddresses }))(wallets, importedAddresses)
}
