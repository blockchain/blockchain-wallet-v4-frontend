import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

const getData = (state: RootState) => {
  const bankCredentialsR = selectors.components.brokerage.getBankCredentials(state)
  const isFlow = selectors.components.brokerage.getIsFlow(state)

  return lift((bankCredentials: ExtractSuccess<typeof bankCredentialsR>) => ({
    bankCredentials,
    isFlow
  }))(bankCredentialsR)
}

export default getData
