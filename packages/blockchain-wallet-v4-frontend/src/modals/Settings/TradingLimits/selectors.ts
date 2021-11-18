import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

const getData = (state: RootState) => {
  const limitsAndDetailsR = selectors.components.settings.getLimitsAndDetails(state)

  return lift((limitsAndDetails: ExtractSuccess<typeof limitsAndDetailsR>) => ({
    limitsAndDetails
  }))(limitsAndDetailsR)
}

export default getData
