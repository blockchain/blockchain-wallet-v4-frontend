import { lift } from 'ramda'
import { RootState } from 'data/rootReducer'
import { selectors } from 'data'

export const getData = (state: RootState) => {
  const ratesR = selectors.components.interest.getRates(state)
  const formErrors = selectors.form.getFormSyncErrors('interestDepositForm')(
    state
  )
  const coin = selectors.components.interest.getCoinType(state)
  const interestLimitsR = selectors.components.interest.getInterestLimits(state)
  const interestRateR = selectors.components.interest.getInterestRate(state)
  const depositLimits = selectors.components.interest.getDepositLimits(state)
  const displayCoin = selectors.components.interest.getCoinDisplay(state)
  const paymentR = selectors.components.interest.getPayment(state)
  const supportedCoinsR = selectors.core.walletOptions.getSupportedCoins(state)
  const walletCurrencyR = selectors.core.settings.getCurrency(state)

  return lift(
    (
      rates,
      interestLimits,
      interestRate,
      payment,
      supportedCoins,
      walletCurrency
    ) => ({
      coin,
      formErrors,
      depositLimits,
      displayCoin,
      interestLimits,
      interestRate,
      payment,
      rates,
      supportedCoins,
      walletCurrency
    })
  )(
    ratesR,
    interestLimitsR,
    interestRateR,
    paymentR,
    supportedCoinsR,
    walletCurrencyR
  )
}
