import { ExtractSuccess } from 'core/types'
import { lift } from 'ramda'
import { RootState } from 'data/rootReducer'
import { selectors } from 'data'

export const getData = (state: RootState) => {
  const cardsR = selectors.components.simpleBuy.getSBCards(state)
  const transform = (cards: ExtractSuccess<typeof cardsR>) => ({ cards })

  const x = lift(transform)(cardsR)
  return x
}
