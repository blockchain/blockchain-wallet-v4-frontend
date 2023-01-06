import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getData = (state: RootState) => {
  const activeRewardsRatesR = selectors.components.interest.getActiveRewardsRates(state)

  const transform = (activeRewardsRates: ExtractSuccess<typeof activeRewardsRatesR>) => {
    const rate = activeRewardsRates?.BTC.rate
    return { rate }
  }

  return lift(transform)(activeRewardsRatesR)
}
