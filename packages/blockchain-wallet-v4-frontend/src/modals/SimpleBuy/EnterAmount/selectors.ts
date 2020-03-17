import { lift } from 'ramda'
import { selectors } from 'data'

export const getData = state => {
  const pairsR = selectors.components.simpleBuy.getSBPairs(state)

  return lift(pairs => ({ pairs }))(pairsR)
}
