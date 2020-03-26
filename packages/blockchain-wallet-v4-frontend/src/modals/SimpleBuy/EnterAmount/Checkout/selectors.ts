import { lift } from 'ramda'
import { RootState } from 'data/rootReducer'
import { selectors } from 'data'

export const getData = (state: RootState) => {
  const formErrors = selectors.form.getFormSyncErrors('simpleBuyCheckout')(
    state
  )
  const formValues = selectors.form.getFormValues('simpleBuyCheckout')(state)
  const suggestedAmountsR = selectors.components.simpleBuy.getSBSuggestedAmounts(
    state
  )
  const supportedCoinsR = selectors.core.walletOptions.getSupportedCoins(state)
  const userDataR = selectors.modules.profile.getUserData(state)

  const bchRatesR = selectors.core.data.bch.getRates(state)
  const btcRatesR = selectors.core.data.btc.getRates(state)
  const ethRatesR = selectors.core.data.eth.getRates(state)
  const paxRatesR = selectors.core.data.eth.getErc20Rates(state, 'pax')
  const xlmRatesR = selectors.core.data.xlm.getRates(state)

  const ratesR = lift((bchRates, btcRates, ethRates, paxRates, xlmRates) => ({
    BCH: bchRates,
    BTC: btcRates,
    ETH: ethRates,
    PAX: paxRates,
    XLM: xlmRates
  }))(bchRatesR, btcRatesR, ethRatesR, paxRatesR, xlmRatesR)

  return lift((rates, suggestedAmounts, supportedCoins, userData) => ({
    formErrors,
    formValues,
    rates,
    suggestedAmounts,
    supportedCoins,
    userData
  }))(ratesR, suggestedAmountsR, supportedCoinsR, userDataR)
}
