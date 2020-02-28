import { lift } from 'ramda'
import { RootState } from 'data/rootReducer'
import { selectors } from 'data'

export const getData = (state: RootState) => {
  const ratesR = selectors.components.borrow.getRates(state)

  return lift(rates => ({ rates }))(ratesR)
}
