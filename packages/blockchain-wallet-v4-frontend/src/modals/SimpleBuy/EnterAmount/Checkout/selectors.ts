import { lift } from 'ramda'
import { RootState } from 'data/rootReducer'
import { selectors } from 'data'

export const getData = (state: RootState) => {
  const suggestedAmountsR = selectors.components.simpleBuy.getSBSuggestedAmounts(
    state
  )
  const userDataR = selectors.modules.profile.getUserData(state)

  return lift((suggestedAmounts, userData) => ({ suggestedAmounts, userData }))(
    suggestedAmountsR,
    userDataR
  )
}
