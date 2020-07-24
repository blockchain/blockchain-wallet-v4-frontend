import { ExtractSuccess, FiatType } from 'core/types'
import { lift } from 'ramda'
import { selectors } from 'data'

export const getData = state => {
  const walletCurrencyR = selectors.core.settings.getCurrency(state)
  const defaultMethodR = selectors.components.simpleBuy.getDefaultPaymentMethod(
    state
  )
  const eligibilityR = selectors.components.simpleBuy.getSBFiatEligible(state)
  const paymentMethodsR = selectors.components.simpleBuy.getSBPaymentMethods(
    state
  )

  return lift(
    (
      defaultMethod: ExtractSuccess<typeof defaultMethodR>,
      eligibility: ExtractSuccess<typeof eligibilityR>,
      paymentMethods: ExtractSuccess<typeof paymentMethodsR>,
      walletCurrency: FiatType
    ) => ({
      defaultMethod,
      eligibility,
      paymentMethods,
      walletCurrency
    })
  )(defaultMethodR, eligibilityR, paymentMethodsR, walletCurrencyR)
}
