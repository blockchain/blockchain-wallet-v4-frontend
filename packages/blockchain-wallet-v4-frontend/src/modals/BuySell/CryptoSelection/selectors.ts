import { lift } from 'ramda'

import { ExtractSuccess, FiatType } from '@core/types'
import { createDeepEqualSelector } from 'blockchain-wallet-v4/src/utils'
import { model, selectors } from 'data'
import { SWAP_ACCOUNTS_SELECTOR } from 'data/coins/model/swap'
import { getCoinAccounts } from 'data/coins/selectors'
import { BSCheckoutFormValuesType } from 'data/types'

const { FORM_BS_CHECKOUT } = model.components.buySell
export const getData = (state) => {
  const eligibilityR = selectors.components.buySell.getBSFiatEligible(state)
  const formValues = selectors.form.getFormValues(FORM_BS_CHECKOUT)(
    state
  ) as BSCheckoutFormValuesType
  const emailVerifiedR = selectors.core.settings.getEmailVerified(state)
  const sbOrdersR = selectors.components.buySell.getBSOrders(state)
  const sddEligibleR = selectors.components.buySell.getSddEligible(state)
  // checks orderType on state for the 'SELL' button on top of activity feed
  const stateOrderType = selectors.components.buySell.getOrderType(state)
  const pairsR = selectors.components.buySell.getBSPairs(state)
  const userDataR = selectors.modules.profile.getUserData(state)
  const walletCurrencyR = selectors.core.settings.getCurrency(state)

  // for sell, get 'swap' accounts
  const coins = selectors.components.swap.getCoins()
  const accounts = getCoinAccounts(state, { coins, ...SWAP_ACCOUNTS_SELECTOR })

  return lift(
    (
      eligibility: ExtractSuccess<typeof eligibilityR>,
      emailVerified: ExtractSuccess<typeof emailVerifiedR>,
      pairs: ExtractSuccess<typeof pairsR>,
      userData: ExtractSuccess<typeof userDataR>,
      sbOrders: ExtractSuccess<typeof sbOrdersR>,
      sddEligible: ExtractSuccess<typeof sddEligibleR>,
      walletCurrency: FiatType
    ) => ({
      accounts,
      eligibility,

      emailVerified,
      // Doing this to check if state has been updated for orderType to be 'SELL'
      // If user clicks on sell button on activity feed header
      orderType: formValues ? formValues.orderType : stateOrderType || 'BUY',
      pairs,
      sbOrders,
      sddEligible,
      userData,
      walletCurrency
    })
  )(eligibilityR, emailVerifiedR, pairsR, userDataR, sbOrdersR, sddEligibleR, walletCurrencyR)
}

export default getData
