import { lift } from 'ramda'
import { RemoteDataType, SBCardType } from 'core/types'
import { RootState } from 'data/rootReducer'
import { selectors } from 'data'

export const getData = (state: RootState) => {
  const cardsR = selectors.components.simpleBuy.getSBCards(state)

  const transform = (cards: Array<SBCardType>) => ({ cards })

  return lift(transform)(cardsR) as RemoteDataType<
    string,
    ReturnType<typeof transform>
  >
}
