import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getRemote = (state: RootState) => {
  const activeRatesR = selectors.components.interest.getActiveRewardsRates(state)
  const passiveRatesR = selectors.components.interest.getInterestRates(state)
  const stakingRatesR = selectors.components.interest.getStakingRates(state)
  const isPassiveEligibleR = selectors.components.interest.getInterestEligible(state)
  const isStakingEligibleR = selectors.components.interest.getStakingEligible(state)
  const isActiveEligibleR = selectors.components.interest.getActiveRewardsEligible(state)

  return lift(
    (
      activeRates: ExtractSuccess<typeof activeRatesR>,
      isActiveEligible: ExtractSuccess<typeof isActiveEligibleR>,
      isPassiveEligible: ExtractSuccess<typeof isPassiveEligibleR>,
      isStakingEligible: ExtractSuccess<typeof isStakingEligibleR>,
      passiveRates: ExtractSuccess<typeof passiveRatesR>,
      stakingRates: ExtractSuccess<typeof stakingRatesR>
    ) => {
      const maxPassiveRates = Math.max(...Object.values(passiveRates))
      const maxActiveRates = Math.max(...Object.values(activeRates).map(({ rate }) => rate))
      const maxStakingRates = Math.max(...Object.values(stakingRates).map(({ rate }) => rate))

      return {
        isActiveEligible: isActiveEligible.eligible !== false,
        isPassiveEligible: isPassiveEligible.eligible !== false,
        isStakingEligible: isStakingEligible.eligible !== false,
        maxPercentage: Math.max(maxPassiveRates, maxActiveRates, maxStakingRates)
      }
    }
  )(
    activeRatesR,
    isActiveEligibleR,
    isPassiveEligibleR,
    isStakingEligibleR,
    passiveRatesR,
    stakingRatesR
  )
}
