import { lift } from 'ramda'

import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

const getData = (state: RootState) => {
  const rewardsRatesR = selectors.components.interest.getInterestRates(state)
  const stakingRatesR = selectors.components.interest.getStakingRates(state)

  const transform = (rewardsRates, stakingRates) => ({
    rewardsRates,
    stakingRates
  })

  return lift(transform)(rewardsRatesR, stakingRatesR)
}

export default getData
