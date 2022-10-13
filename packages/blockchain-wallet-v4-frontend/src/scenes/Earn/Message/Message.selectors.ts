import { lift } from 'ramda'

import { EarnEDDStatus } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

const getData = (state: RootState) => {
  const rewardsRatesR = selectors.components.interest.getInterestRates(state)
  const stakingRatesR = selectors.components.interest.getStakingRates(state)
  const earnEDDStatus = selectors.components.interest.getEarnEDDStatus(state).getOrElse({
    eddNeeded: false
  } as EarnEDDStatus)

  const transform = (rewardsRates, stakingRates) => ({
    earnEDDStatus,
    rewardsRates,
    stakingRates
  })

  return lift(transform)(rewardsRatesR, stakingRatesR)
}

export default getData
