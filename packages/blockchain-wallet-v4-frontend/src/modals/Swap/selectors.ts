import { lift } from 'ramda'

import { ExtractSuccess, FiatType } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getData = (state: RootState) => {
  const interestEligibleR = selectors.components.interest.getInterestEligible(state)
  const interestRateR = selectors.components.interest.getInterestRate(state)
  const userDataR = selectors.modules.profile.getUserData(state)
  const walletCurrencyR = selectors.core.settings.getCurrency(state)
  const fix = selectors.components.swap.getFix(state)
  const custodialEligibilityR = selectors.components.swap.getCustodialEligibility(state)
  const productsR = selectors.custodial.getProductEligibilityForUser(state)
  const isRewardsFlowAfterSwapEnabled = selectors.core.walletOptions
    .getRewardsFlowUnderSwapEnabled(state)
    .getOrElse(false) as boolean

  return lift(
    (
      userData: ExtractSuccess<typeof userDataR>,
      walletCurrency: FiatType,
      custodialEligibility: ExtractSuccess<typeof custodialEligibilityR>,
      products: ExtractSuccess<typeof productsR>,
      interestRate: ExtractSuccess<typeof interestRateR>,
      interestEligible: ExtractSuccess<typeof interestEligibleR>
    ) => ({
      custodialEligibility,
      fix,
      interestEligible,
      interestRate,
      isRewardsFlowAfterSwapEnabled,
      products,
      userData,
      walletCurrency
    })
  )(userDataR, walletCurrencyR, custodialEligibilityR, productsR, interestRateR, interestEligibleR)
}

export default getData
