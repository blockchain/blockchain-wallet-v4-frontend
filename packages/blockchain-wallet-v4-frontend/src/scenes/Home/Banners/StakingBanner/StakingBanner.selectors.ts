import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getData = (state: RootState) => {
  const stakingRatesR = selectors.components.interest.getStakingRates(state)

  const transform = (stakingRates: ExtractSuccess<typeof stakingRatesR>) => {
    const rate = stakingRates?.ETH.rate
    return { rate }
  }

  return lift(transform)(stakingRatesR)
}
