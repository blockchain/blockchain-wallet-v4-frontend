import { ExtractSuccess, FiatType } from 'core/types'
import { lift } from 'ramda'
import { selectors } from 'data'

export const getData = state => {
  const cardsR = selectors.components.simpleBuy.getSBCards(state)
  const eligibilityR = selectors.components.simpleBuy.getSBFiatEligible(state)
  const pairsR = selectors.components.simpleBuy.getSBPairs(state)
  const paymentMethodsR = selectors.components.simpleBuy.getSBPaymentMethods(
    state
  )
  const balancesR = selectors.components.simpleBuy.getSBBalances(state)
  const walletCurrencyR = selectors.core.settings.getCurrency(state)

  return lift(
    (
      balances: ExtractSuccess<typeof balancesR>,
      cards: ExtractSuccess<typeof cardsR>,
      eligibility: ExtractSuccess<typeof eligibilityR>,
      pairs: ExtractSuccess<typeof pairsR>,
      paymentMethods: ExtractSuccess<typeof paymentMethodsR>,
      walletCurrency: FiatType
    ) => ({
      balances,
      cards,
      eligibility,
      pairs,
      paymentMethods,
      walletCurrency
    })
  )(balancesR, cardsR, eligibilityR, pairsR, paymentMethodsR, walletCurrencyR)
}
