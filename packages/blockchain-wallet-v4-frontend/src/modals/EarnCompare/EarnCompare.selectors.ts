import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getRemote = (state: RootState) => {
  const activeRatesR = selectors.components.interest.getActiveRewardsRates(state)
  const passiveRatesR = selectors.components.interest.getInterestRates(state)
  const stakingRatesR = selectors.components.interest.getStakingRates(state)
  const activeRewardsEligibleR = selectors.components.interest.getActiveRewardsEligible(state)
  const stakingEligibleR = selectors.components.interest.getStakingEligible(state)

  return lift(
    (
      activeRewardsEligible: ExtractSuccess<typeof activeRewardsEligibleR>,
      activeRates: ExtractSuccess<typeof activeRatesR>,
      passiveRates: ExtractSuccess<typeof passiveRatesR>,
      stakingRates: ExtractSuccess<typeof stakingRatesR>,
      stakingEligible: ExtractSuccess<typeof stakingEligibleR>
    ) => {
      const maxPassiveRate = Math.max(...Object.values(passiveRates))
      const maxActiveRate = Math.max(...Object.values(activeRates).map(({ rate }) => rate))
      const maxStakingRate = Math.max(...Object.values(stakingRates).map(({ rate }) => rate))
      const activeRewards = Object.keys(activeRewardsEligible).filter(
        (coin) => activeRewardsEligible[coin].eligible
      )

      const staking = Object.keys(stakingEligible).filter((coin) => stakingEligible[coin].eligible)

      return {
        activeRewards,
        maxActiveRate,
        maxPassiveRate,
        maxStakingRate,
        staking
      }
    }
  )(activeRewardsEligibleR, activeRatesR, passiveRatesR, stakingRatesR, stakingEligibleR)
}
