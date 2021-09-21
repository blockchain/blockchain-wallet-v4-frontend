import { lift } from 'ramda'

import { ExtractSuccess } from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'

export const getCurrency = (state) => {
  return selectors.core.settings.getCurrency(state)
}

export const getData = (state) => {
  const accountBalancesR = selectors.components.interest.getInterestAccountBalance(state)
  const interestLimitsR = selectors.components.interest.getInterestLimits(state)
  const interestRateR = selectors.components.interest.getInterestRate(state)
  const flagEDDInterestFileUpload = selectors.core.walletOptions
    .getEDDInterestFileUpload(state)
    .getOrElse(false)

  return lift(
    (
      accountBalances: ExtractSuccess<typeof accountBalancesR>,
      interestLimits: ExtractSuccess<typeof interestLimitsR>,
      interestRate: ExtractSuccess<typeof interestRateR>
    ) => ({
      accountBalances,
      flagEDDInterestFileUpload,
      interestLimits,
      interestRate
    })
  )(accountBalancesR, interestLimitsR, interestRateR)
}
