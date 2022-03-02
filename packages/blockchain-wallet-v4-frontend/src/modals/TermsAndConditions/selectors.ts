import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getData = (state: RootState) => {
  const termsAndConditionsR = selectors.components.termsAndConditions.getTermsAndConditions(state)

  return lift((termsAndConditions: ExtractSuccess<typeof termsAndConditionsR>) => ({
    termsAndConditions
  }))(termsAndConditionsR)
}
