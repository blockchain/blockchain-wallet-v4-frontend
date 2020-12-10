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
  // checks orderType on state for the 'SELL' button on top of actitivty feed
  const stateOrderType = selectors.components.simpleBuy.getOrderType(state)
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
      // Doing this to check if state has been updated for orderType to be 'SELL'
      // If user clicks on sell button on activity feed header
      orderType: formValues
        ? formValues.orderType
        : stateOrderType || 'BUY',
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
