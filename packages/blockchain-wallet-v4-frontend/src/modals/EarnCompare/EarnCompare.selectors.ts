import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getRemote = (state: RootState) => {
  const activeRatesR = selectors.components.interest.getActiveRewardsRates(state)
  const passiveRatesR = selectors.components.interest.getInterestRates(state)
  const stakingRatesR = selectors.components.interest.getStakingRates(state)

  return lift(
    (
      activeRates: ExtractSuccess<typeof activeRatesR>,
      passiveRates: ExtractSuccess<typeof passiveRatesR>,
      stakingRates: ExtractSuccess<typeof stakingRatesR>
    ) => {
      const maxPassiveRate = Math.max(...Object.values(passiveRates))
      const maxActiveRate = Math.max(...Object.values(activeRates).map(({ rate }) => rate))
      const maxStakingRate = Math.max(...Object.values(stakingRates).map(({ rate }) => rate))
      return {
        maxActiveRate,
        maxPassiveRate,
        maxStakingRate
      }
    }
  )(activeRatesR, passiveRatesR, stakingRatesR)
}
