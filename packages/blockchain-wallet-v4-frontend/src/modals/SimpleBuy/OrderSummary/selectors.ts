import { ExtractSuccess, RemoteDataType } from 'core/types'
import { lift } from 'ramda'
import { RootState } from 'data/rootReducer'
import { selectors } from 'data'

export const getData = (state: RootState) => {
  const cardsR = selectors.components.simpleBuy.getSBCards(state)
  const transform = (cards: ExtractSuccess<typeof cardsR>) => ({ cards })
  return lift(transform)(cardsR) as RemoteDataType<
    string,
    ReturnType<typeof transform>
  >
}
