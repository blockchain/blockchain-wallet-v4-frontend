import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

import { getAddressDataR, getHasNonCustodialBalance } from '../../Earn.utils'

export const getCurrency = (state: RootState) => {
  return selectors.core.settings.getCurrency(state)
}

export const getData = (state: RootState) => {
  const coin = selectors.components.interest.getCoinType(state)
  const accountBalancesR = selectors.components.interest.getStakingAccountBalance(state)
  const pendingTransactionsR = selectors.components.interest.getPendingStakingTransactions(state)
  const earnEDDStatusR = selectors.components.interest.getEarnEDDStatus(state)
  const stakingEligibleR = selectors.components.interest.getStakingEligible(state)
  const stakingRatesR = selectors.components.interest.getStakingRates(state)
  const totalBondingDeposits = selectors.components.interest.getTotalStakingBondingDeposits(state)
  const stakingWithdrawalsR = selectors.components.interest.getStakingWithdrawals(state)
  const buySellBalanceR = selectors.components.buySell.getBSBalances(state)

  const addressDataR = getAddressDataR(state, coin)

  return lift(
    (
      accountBalances: ExtractSuccess<typeof accountBalancesR>,
      addressData,
      buySellBalance: ExtractSuccess<typeof buySellBalanceR>,
      earnEDDStatus: ExtractSuccess<typeof earnEDDStatusR>,
      pendingTransactions: ExtractSuccess<typeof pendingTransactionsR>,
      stakingRates: ExtractSuccess<typeof stakingRatesR>,
      stakingEligible: ExtractSuccess<typeof stakingEligibleR>,
      stakingWithdrawals: ExtractSuccess<typeof stakingWithdrawalsR>
    ) => {
      const hasNonCustodialBalance: boolean = getHasNonCustodialBalance(addressData)
      const hasBuySellBalance = !!buySellBalance[coin]?.available

      return {
        accountBalances,
        earnEDDStatus,
        hasBalance: hasNonCustodialBalance || hasBuySellBalance,
        pendingTransactions,
        stakingEligible,
        stakingRates,
        stakingWithdrawals,
        totalBondingDeposits
      }
    }
  )(
    accountBalancesR,
    addressDataR,
    buySellBalanceR,
    earnEDDStatusR,
    pendingTransactionsR,
    stakingRatesR,
    stakingEligibleR,
    stakingWithdrawalsR
  )
}
