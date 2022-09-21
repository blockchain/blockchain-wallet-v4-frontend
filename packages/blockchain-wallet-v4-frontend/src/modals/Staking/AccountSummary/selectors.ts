import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getCurrency = (state: RootState) => {
  return selectors.core.settings.getCurrency(state)
}

export const getData = (state: RootState) => {
  const accountBalancesR = selectors.components.interest.getStakingAccountBalance(state)
  const interestLimitsR = selectors.components.interest.getStakingLimits(state)
  const interestEligibleR = selectors.components.interest.getStakingEligible(state)
  const interestRatesR = selectors.components.interest.getStakingRates(state)
  const flagEDDInterestFileUpload = selectors.core.walletOptions
    .getEDDInterestFileUpload(state)
    .getOrElse(false)

  return lift(
    (
      accountBalances: ExtractSuccess<typeof accountBalancesR>,
      interestLimits: ExtractSuccess<typeof interestLimitsR>,
      interestRates: ExtractSuccess<typeof interestRatesR>,
      interestEligible: ExtractSuccess<typeof interestEligibleR>
    ) => ({
      accountBalances,
      flagEDDInterestFileUpload,
      interestEligible,
      interestLimits,
      interestRates
    })
  )(accountBalancesR, interestLimitsR, interestRatesR, interestEligibleR)
}
