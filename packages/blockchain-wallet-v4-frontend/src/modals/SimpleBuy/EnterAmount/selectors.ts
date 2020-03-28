import { lift } from 'ramda'
import { selectors } from 'data'

export const getData = state => {
  const pairsR = selectors.components.simpleBuy.getSBPairs(state)
  const eligibilityR = selectors.components.simpleBuy.getSBFiatEligible(state)

  return lift((pairs, eligibility) => ({ pairs, eligibility }))(
    pairsR,
    eligibilityR
  )
}
