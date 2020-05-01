import { lift } from 'ramda'
import { selectors } from 'data'

export const getData = state => {
  const coin = selectors.components.interest.getCoinType(state)
  const ratesR = selectors.components.borrow.getRates(state)
  const supportedCoinsR = selectors.core.walletOptions.getSupportedCoins(state)
  const formValues = selectors.form.getFormValues('withdrawalForm')(state) || {
    withdrawalAmount: 0
  }

  return lift((rates, supportedCoins) => ({
    coin,
    formValues,
    rates,
    supportedCoins
  }))(ratesR, supportedCoinsR)
}
