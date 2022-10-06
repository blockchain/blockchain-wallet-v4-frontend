import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getCurrency = (state: RootState) => {
  return selectors.core.settings.getCurrency(state)
}

export const getData = (state: RootState) => {
  const accountBalancesR = selectors.components.interest.getStakingAccountBalance(state)
  const pendingTransactionsR = selectors.components.interest.getPendingStakingTransactions(state)
  const stakingLimitsR = selectors.components.interest.getStakingLimits(state)
  const earnEDDStatusR = selectors.components.interest.getEarnEDDStatus(state)
  const stakingEligibleR = selectors.components.interest.getStakingEligible(state)
  const stakingRatesR = selectors.components.interest.getStakingRates(state)
  const flagEDDInterestFileUpload = selectors.core.walletOptions
    .getEDDInterestFileUpload(state)
    .getOrElse(false)

  return lift(
    (
      accountBalances: ExtractSuccess<typeof accountBalancesR>,
      earnEDDStatus: ExtractSuccess<typeof earnEDDStatusR>,
      pendingTransactions: ExtractSuccess<typeof pendingTransactionsR>,
      stakingLimits: ExtractSuccess<typeof stakingLimitsR>,
      stakingRates: ExtractSuccess<typeof stakingRatesR>,
      stakingEligible: ExtractSuccess<typeof stakingEligibleR>
    ) => ({
      accountBalances,
      earnEDDStatus,
      flagEDDInterestFileUpload,
      pendingTransactions,
      stakingEligible,
      stakingLimits,
      stakingRates
    })
  )(
    accountBalancesR,
    earnEDDStatusR,
    pendingTransactionsR,
    stakingLimitsR,
    stakingRatesR,
    stakingEligibleR
  )
}
