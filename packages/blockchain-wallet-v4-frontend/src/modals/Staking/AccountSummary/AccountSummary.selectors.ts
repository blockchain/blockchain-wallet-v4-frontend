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
  const earnEDDStatusR = selectors.components.interest.getEarnEDDStatus(state)
  const stakingEligibleR = selectors.components.interest.getStakingEligible(state)
  const stakingRatesR = selectors.components.interest.getStakingRates(state)
  const totalBondingDeposits = selectors.components.interest.getTotalBondingDeposits(state)

  return lift(
    (
      accountBalances: ExtractSuccess<typeof accountBalancesR>,
      earnEDDStatus: ExtractSuccess<typeof earnEDDStatusR>,
      pendingTransactions: ExtractSuccess<typeof pendingTransactionsR>,
      stakingRates: ExtractSuccess<typeof stakingRatesR>,
      stakingEligible: ExtractSuccess<typeof stakingEligibleR>
    ) => ({
      accountBalances,
      earnEDDStatus,
      pendingTransactions,
      stakingEligible,
      stakingRates,
      totalBondingDeposits
    })
  )(accountBalancesR, earnEDDStatusR, pendingTransactionsR, stakingRatesR, stakingEligibleR)
}
