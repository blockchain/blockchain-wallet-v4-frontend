import { ExtractSuccess, FiatType } from 'core/types'
import { lift } from 'ramda'
import { SBCheckoutFormValuesType } from 'data/types'
import { selectors } from 'data'

export const getData = state => {
  const coinsR = selectors.core.walletOptions.getSupportedCoins(state)
  const eligibilityR = selectors.components.simpleBuy.getSBFiatEligible(state)
  const formValues = selectors.form.getFormValues('simpleBuyCheckout')(
    state
  ) as SBCheckoutFormValuesType
  const invitationsR = selectors.core.settings.getInvitations(state)
  const pairsR = selectors.components.simpleBuy.getSBPairs(state)
  const userDataR = selectors.modules.profile.getUserData(state)
  const walletCurrencyR = selectors.core.settings.getCurrency(state)

  // for sell, get 'swap' accounts
  const accounts = selectors.components.swap.getActiveAccounts(state)

  return lift(
    (
      coins: ExtractSuccess<typeof coinsR>,
      eligibility: ExtractSuccess<typeof eligibilityR>,
      invitations: ExtractSuccess<typeof invitationsR>,
      pairs: ExtractSuccess<typeof pairsR>,
      userData: ExtractSuccess<typeof userDataR>,
      walletCurrency: FiatType
    ) => ({
      orderType: formValues ? formValues.orderType : 'BUY',
      accounts,
      coins,
      eligibility,
      invitations,
      pairs,
      userData,
      walletCurrency
    })
  )(coinsR, eligibilityR, invitationsR, pairsR, userDataR, walletCurrencyR)
}
