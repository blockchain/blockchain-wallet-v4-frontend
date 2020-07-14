import { ExtractSuccess, SupportedCoinsType } from 'core/types'
import { lift } from 'ramda'
import { selectors } from 'data'

export const getData = state => {
  const eligibilityR = selectors.components.simpleBuy.getSBFiatEligible(state)
  const pairsR = selectors.components.simpleBuy.getSBPairs(state)
  const supportedCoinsR = selectors.core.walletOptions.getSupportedCoins(state)

  return lift(
    (
      eligibility: ExtractSuccess<typeof eligibilityR>,
      pairs: ExtractSuccess<typeof pairsR>,
      supportedCoins: SupportedCoinsType
    ) => ({
      eligibility,
      pairs,
      supportedCoins
    })
  )(eligibilityR, pairsR, supportedCoinsR)
}
