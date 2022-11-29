import { lift } from 'ramda'

import { ExtractSuccess, FiatType } from '@core/types'
import { selectors } from 'data'

export const getData = (state) => {
  const interestAccountBalanceR = selectors.components.interest.getRewardsAccountBalance(state)
  const stakingAccountBalanceR = selectors.components.interest.getStakingAccountBalance(state)
  const interestEligibleR = selectors.components.interest.getInterestEligible(state)
  const stakingEligibleR = selectors.components.interest.getStakingEligible(state)
  const showInterestInfoBox = selectors.preferences.getShowInterestInfoBox(state) as boolean
  const walletCurrencyR = selectors.core.settings.getCurrency(state)
  const sortedInstrumentsR = selectors.components.interest.getInstrumentsSortedByBalance(state)
  const earnTab = selectors.components.interest.getEarnTab(state)
  const searchValue = selectors.components.interest.getSearchValue(state)
  const showAvailableAssets = selectors.components.interest.getShowAvailableAssets(state)

  return lift(
    (
      interestAccountBalance: ExtractSuccess<typeof interestAccountBalanceR>,
      sortedInstruments: ExtractSuccess<typeof sortedInstrumentsR>,
      stakingAccountBalance: ExtractSuccess<typeof stakingAccountBalanceR>,
      interestEligible: ExtractSuccess<typeof interestEligibleR>,
      stakingEligible: ExtractSuccess<typeof stakingEligibleR>,
      walletCurrency: FiatType
    ) => ({
      earnTab,
      interestAccountBalance,
      interestEligible,
      searchValue,
      showAvailableAssets,
      showInterestInfoBox,
      sortedInstruments,
      stakingAccountBalance,
      stakingEligible,
      walletCurrency
    })
  )(
    interestAccountBalanceR,
    sortedInstrumentsR,
    stakingAccountBalanceR,
    interestEligibleR,
    stakingEligibleR,
    walletCurrencyR
  )
}
