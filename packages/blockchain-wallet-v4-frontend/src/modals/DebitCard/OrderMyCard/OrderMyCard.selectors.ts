import { lift } from 'ramda'

import { ExtractSuccess } from '@core/remote/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getData = (state: RootState) => {
  const cardCreationR = selectors.components.debitCard.getCardCreationData(state)
  return lift((cardCreation: ExtractSuccess<typeof cardCreationR>) => cardCreation)(cardCreationR)
}
