import { lift } from 'ramda'
import { RootState } from 'data/rootReducer'
import { selectors } from 'data'

export const getData = (state: RootState) => {
  const suggestedAmountsR = selectors.components.simpleBuy.getSBSuggestedAmounts(
    state
  )

  return lift(suggestedAmounts => ({ suggestedAmounts }))(suggestedAmountsR)
}
