import { lift } from 'ramda'

import { ExtractSuccess, FiatType } from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'
import { SWAP_ACCOUNTS_SELECTOR } from 'data/coins/model/swap'
import { getCoinAccounts } from 'data/coins/selectors'
import { SBCheckoutFormValuesType } from 'data/types'

export const getData = state => {
  const coinsR = selectors.core.walletOptions.getSupportedCoins(state)
  const eligibilityR = selectors.components.simpleBuy.getSBFiatEligible(state)
  const formValues = selectors.form.getFormValues('simpleBuyCheckout')(
    state
  ) as SBCheckoutFormValuesType
  const emailVerifiedR = selectors.core.settings.getEmailVerified(state)
  const sbOrdersR = selectors.components.simpleBuy.getSBOrders(state)
  const sddEligibleR = selectors.components.simpleBuy.getSddEligible(state)
  // checks orderType on state for the 'SELL' button on top of activity feed
  const stateOrderType = selectors.components.simpleBuy.getOrderType(state)
  const pairsR = selectors.components.simpleBuy.getSBPairs(state)
  const userDataR = selectors.modules.profile.getUserData(state)
  const walletCurrencyR = selectors.core.settings.getCurrency(state)

  // for sell, get 'swap' accounts
  const accounts = getCoinAccounts(state, SWAP_ACCOUNTS_SELECTOR)

  return lift(
    (
      coins: ExtractSuccess<typeof coinsR>,
      eligibility: ExtractSuccess<typeof eligibilityR>,
      emailVerified: ExtractSuccess<typeof emailVerifiedR>,
      pairs: ExtractSuccess<typeof pairsR>,
      userData: ExtractSuccess<typeof userDataR>,
      sbOrders: ExtractSuccess<typeof sbOrdersR>,
      sddEligible: ExtractSuccess<typeof sddEligibleR>,
      walletCurrency: FiatType
    ) => ({
      // Doing this to check if state has been updated for orderType to be 'SELL'
      // If user clicks on sell button on activity feed header
      orderType: formValues ? formValues.orderType : stateOrderType || 'BUY',
      accounts,
      coins,
      eligibility,
      emailVerified,
      pairs,
      userData,
      sbOrders,
      sddEligible,
      walletCurrency
    })
  )(
    coinsR,
    eligibilityR,
    emailVerifiedR,
    pairsR,
    userDataR,
    sbOrdersR,
    sddEligibleR,
    walletCurrencyR
  )
}
