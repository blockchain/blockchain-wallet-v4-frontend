import { lift } from 'ramda'

import { ExtractSuccess, FiatType } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

const getData = (state: RootState) => {
  const walletCurrencyR = selectors.core.settings.getCurrency(state)
  const defaultMethodR = selectors.components.buySell.getDefaultPaymentMethod(state)
  const eligibilityR = selectors.components.buySell.getBSFiatEligible(state)
  const pairsR = selectors.components.buySell.getBSPairs(state)
  const paymentMethodsR = selectors.components.buySell.getBSPaymentMethods(state)
  const swapAccount = selectors.components.buySell.getSwapAccount(state)

  return lift(
    (
      defaultMethod: ExtractSuccess<typeof defaultMethodR>,
      eligibility: ExtractSuccess<typeof eligibilityR>,
      pairs: ExtractSuccess<typeof pairsR>,
      paymentMethods: ExtractSuccess<typeof paymentMethodsR>,
      walletCurrency: FiatType
    ) => ({
      defaultMethod,
      eligibility,
      pairs,
      paymentMethods,
      swapAccount,
      walletCurrency
    })
  )(defaultMethodR, eligibilityR, pairsR, paymentMethodsR, walletCurrencyR)
}

export default getData
