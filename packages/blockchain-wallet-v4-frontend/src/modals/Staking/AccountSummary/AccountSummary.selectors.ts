import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getCurrency = (state: RootState) => {
  return selectors.core.settings.getCurrency(state)
}

export const getData = (state: RootState) => {
  const accountBalancesR = selectors.components.interest.getStakingAccountBalance(state)
  const bondingDepositsR = selectors.components.interest.getEarnBondingDeposits(state)
  const stakingLimitsR = selectors.components.interest.getStakingLimits(state)
  const stakingEligibleR = selectors.components.interest.getStakingEligible(state)
  const stakingRatesR = selectors.components.interest.getStakingRates(state)
  const flagEDDInterestFileUpload = selectors.core.walletOptions
    .getEDDInterestFileUpload(state)
    .getOrElse(false)

  return lift(
    (
      accountBalances: ExtractSuccess<typeof accountBalancesR>,
      bondingDeposits: ExtractSuccess<typeof bondingDepositsR>,
      stakingLimits: ExtractSuccess<typeof stakingLimitsR>,
      stakingRates: ExtractSuccess<typeof stakingRatesR>,
      stakingEligible: ExtractSuccess<typeof stakingEligibleR>
    ) => ({
      accountBalances,
      bondingDeposits,
      flagEDDInterestFileUpload,
      stakingEligible,
      stakingLimits,
      stakingRates
    })
  )(accountBalancesR, bondingDepositsR, stakingLimitsR, stakingRatesR, stakingEligibleR)
}
