import { lift } from 'ramda'

import { ExtractSuccess } from '@core/remote/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getData = (state: RootState) => {
  const terminateHandlerR = selectors.components.debitCard.getTerminateCardHandler(state)
  return lift((terminateHandler: ExtractSuccess<typeof terminateHandlerR>) => terminateHandler)(
    terminateHandlerR
  )
}
