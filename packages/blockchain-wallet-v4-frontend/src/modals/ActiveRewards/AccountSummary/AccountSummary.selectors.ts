import { lift } from 'ramda'
import { bindActionCreators } from 'redux'

import { Exchange } from '@core'
import { ExtractSuccess, FiatType, TimeRange } from '@core/types'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'

import { DataType } from './AccountSummary.types'

export const getActions = (dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  earnActions: bindActionCreators(actions.components.interest, dispatch),
  interestUploadActions: bindActionCreators(actions.components.interestUploadDocument, dispatch)
})

export const getData = (state: RootState): DataType => {
  const walletCurrency: FiatType = selectors.core.settings.getCurrency(state).getOrElse('USD')
  const totalBondingDeposits =
    selectors.components.interest.getTotalActiveRewardsBondingDeposits(state)

  return {
    totalBondingDeposits,
    walletCurrency
  }
}

export const getRemote = (state: RootState) => {
  const coin = selectors.components.interest.getCoinType(state)
  const ratesR = selectors.core.data.coins.getRates(coin, state)
  const walletCurrency = selectors.core.settings.getCurrency(state).getOrElse('USD')
  const priceChangeR = selectors.core.data.misc.getPriceChange(coin, TimeRange.DAY, state)
  const accountBalancesR = selectors.components.interest.getActiveRewardsAccountBalance(state)
  const pendingTransactionsR =
    selectors.components.interest.getPendingActiveRewardsTransactions(state)
  const earnEDDStatusR = selectors.components.interest.getEarnEDDStatus(state)
  const activeRewardsEligibleR = selectors.components.interest.getActiveRewardsEligible(state)
  const activeRewardsRatesR = selectors.components.interest.getActiveRewardsRates(state)
  const isActiveRewardsWithdrawalEnabledR =
    selectors.core.walletOptions.getActiveRewardsWithdrawalEnabled(state)

  return lift(
    (
      accountBalances: ExtractSuccess<typeof accountBalancesR>,
      activeRewardsRates: ExtractSuccess<typeof activeRewardsRatesR>,
      activeRewardsEligible: ExtractSuccess<typeof activeRewardsEligibleR>,
      earnEDDStatus: ExtractSuccess<typeof earnEDDStatusR>,
      isActiveRewardsWithdrawalEnabled: boolean,
      pendingTransactions: ExtractSuccess<typeof pendingTransactionsR>,
      priceChange: ExtractSuccess<typeof priceChangeR>,
      rates: ExtractSuccess<typeof ratesR>
    ) => ({
      accountBalances,
      activeRewardsEligible,
      activeRewardsRates,
      currentPrice: Exchange.displayCoinToFiat({
        rates,
        toCurrency: walletCurrency,
        value: 1
      }),
      earnEDDStatus,
      isActiveRewardsWithdrawalEnabled,
      pendingTransactions,
      priceChange
    })
  )(
    accountBalancesR,
    activeRewardsRatesR,
    activeRewardsEligibleR,
    earnEDDStatusR,
    isActiveRewardsWithdrawalEnabledR,
    pendingTransactionsR,
    priceChangeR,
    ratesR
  )
}
