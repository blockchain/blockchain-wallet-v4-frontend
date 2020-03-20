import { lift } from 'ramda'
import { RootState } from 'data/rootReducer'
import { selectors } from 'data'

export const getData = (state: RootState) => {
  const accountR = selectors.components.simpleBuy.getSBAccount(state)

  return lift(account => ({ account }))(accountR)
}
