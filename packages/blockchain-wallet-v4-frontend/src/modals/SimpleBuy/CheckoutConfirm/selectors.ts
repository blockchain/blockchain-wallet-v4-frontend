import { lift } from 'ramda'
import { RootState } from 'data/rootReducer'
import { selectors } from 'data'

export const getData = (state: RootState) => {
  const quoteR = selectors.components.simpleBuy.getSBQuote(state)

  return lift(quote => ({ quote }))(quoteR)
}
