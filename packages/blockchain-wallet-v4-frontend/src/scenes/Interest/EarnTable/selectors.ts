import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { selectors } from 'data'

export const getData = (state) => {
  const interestAccountBalanceR = selectors.components.interest.getInterestAccountBalance(state)
  const interestEligibleR = selectors.components.interest.getInterestEligible(state)
  const stakingEligibleR = selectors.components.interest.getStakingEligible(state)
  const showInterestInfoBox = selectors.preferences.getShowInterestInfoBox(state) as boolean
  const walletCurrencyR = selectors.core.settings.getCurrency(state)

  return lift(
    (
      interestAccountBalance: ExtractSuccess<typeof interestAccountBalanceR>,
      interestEligible: ExtractSuccess<typeof interestEligibleR>,
      stakingEligible: ExtractSuccess<typeof stakingEligibleR>,
      walletCurrency: ExtractSuccess<typeof walletCurrencyR>
    ) => ({
      interestAccountBalance,
      interestEligible,
      showInterestInfoBox,
      stakingEligible,
      walletCurrency
    })
  )(interestAccountBalanceR, interestEligibleR, stakingEligibleR, walletCurrencyR)
}
