import { lift } from 'ramda'
import { RootState } from 'data/rootReducer'
import { selectors } from 'data'

export const getData = (state: RootState) => {
  const quoteR = selectors.components.simpleBuy.getSBQuote(state)
  const userDataR = selectors.modules.profile.getUserData(state)

  return lift((quote, userData) => ({ quote, userData }))(quoteR, userDataR)
}
