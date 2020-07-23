import { ExtractSuccess } from 'core/types'
import { lift } from 'ramda'
import { selectors } from 'data'

export const getData = state => {
  const eligibilityR = selectors.components.simpleBuy.getSBFiatEligible(state)
  const defaultMethodR = selectors.components.simpleBuy.getDefaultPaymentMethod(
    state
  )
  const pairsR = selectors.components.simpleBuy.getSBPairs(state)
  const userDataR = selectors.modules.profile.getUserData(state)

  return lift(
    (
      eligibility: ExtractSuccess<typeof eligibilityR>,
      defaultMethod: ExtractSuccess<typeof defaultMethodR>,
      pairs: ExtractSuccess<typeof pairsR>,
      userData: ExtractSuccess<typeof userDataR>
    ) => ({
      eligibility,
      defaultMethod,
      pairs,
      userData
    })
  )(eligibilityR, defaultMethodR, pairsR, userDataR)
}
