import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { selectors } from 'data'

export const getData = (state) => {
  const interestAccountBalanceR = selectors.components.interest.getRewardsAccountBalance(state)
  const stakingAccountBalanceR = selectors.components.interest.getStakingAccountBalance(state)
  const interestEligibleR = selectors.components.interest.getInterestEligible(state)
  const stakingEligibleR = selectors.components.interest.getStakingEligible(state)
  const showInterestInfoBox = selectors.preferences.getShowInterestInfoBox(state) as boolean
  const walletCurrencyR = selectors.core.settings.getCurrency(state)

  return lift(
    (
      interestAccountBalance: ExtractSuccess<typeof interestAccountBalanceR>,
      stakingAccountBalance: ExtractSuccess<typeof stakingAccountBalanceR>,
      interestEligible: ExtractSuccess<typeof interestEligibleR>,
      stakingEligible: ExtractSuccess<typeof stakingEligibleR>,
      walletCurrency: ExtractSuccess<typeof walletCurrencyR>
    ) => ({
      interestAccountBalance,
      interestEligible,
      showInterestInfoBox,
      stakingAccountBalance,
      stakingEligible,
      walletCurrency
    })
  )(
    interestAccountBalanceR,
    stakingAccountBalanceR,
    interestEligibleR,
    stakingEligibleR,
    walletCurrencyR
  )
}
