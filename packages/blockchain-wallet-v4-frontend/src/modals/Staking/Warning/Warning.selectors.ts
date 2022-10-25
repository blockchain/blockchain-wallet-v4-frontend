import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getData = (state: RootState) => {
  const stakingLimitsR = selectors.components.interest.getStakingLimits(state)

  return lift((stakingLimits: ExtractSuccess<typeof stakingLimitsR>) => {
    return {
      stakingLimits
    }
  })(stakingLimitsR)
}
