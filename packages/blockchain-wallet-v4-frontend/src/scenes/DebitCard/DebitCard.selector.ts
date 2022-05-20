import { lift } from 'ramda'

import { ExtractSuccess } from '@core/remote/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getData = (state: RootState) => {
  const cardsR = selectors.components.debitCard.getCards(state)
  return lift((cards: ExtractSuccess<typeof cardsR>) => cards)(cardsR)
}
