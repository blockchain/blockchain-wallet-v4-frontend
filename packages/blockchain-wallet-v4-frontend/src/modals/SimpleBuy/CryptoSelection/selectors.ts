import { ExtractSuccess, SupportedWalletCurrenciesType } from 'core/types'
import { lift } from 'ramda'
import { selectors } from 'data'

export const getData = state => {
  const eligibilityR = selectors.components.simpleBuy.getSBFiatEligible(state)
  const pairsR = selectors.components.simpleBuy.getSBPairs(state)
  const supportedCoinsR = selectors.core.walletOptions.getSupportedCoins(state)
  const userDataR = selectors.modules.profile.getUserData(state)

  return lift(
    (
      eligibility: ExtractSuccess<typeof eligibilityR>,
      pairs: ExtractSuccess<typeof pairsR>,
      supportedCoins: SupportedWalletCurrenciesType,
      userData: ExtractSuccess<typeof userDataR>
    ) => ({
      eligibility,
      pairs,
      supportedCoins,
      userData
    })
  )(eligibilityR, pairsR, supportedCoinsR, userDataR)
}
