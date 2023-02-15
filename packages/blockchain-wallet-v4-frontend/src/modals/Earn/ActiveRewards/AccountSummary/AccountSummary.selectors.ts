import { lift } from 'ramda'
import { bindActionCreators } from 'redux'

import { Exchange } from '@core'
import { ExtractSuccess, FiatType, TimeRange } from '@core/types'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'

import { getAddressDataR, getHasNonCustodialBalance } from '../../Earn.utils'
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
  const buySellBalanceR = selectors.components.buySell.getBSBalances(state)
  const addressDataR = getAddressDataR(state, coin)

  return lift(
    (
      accountBalances: ExtractSuccess<typeof accountBalancesR>,
      activeRewardsEligible: ExtractSuccess<typeof activeRewardsEligibleR>,
      activeRewardsRates: ExtractSuccess<typeof activeRewardsRatesR>,
      addressData,
      buySellBalance: ExtractSuccess<typeof buySellBalanceR>,
      earnEDDStatus: ExtractSuccess<typeof earnEDDStatusR>,
      isActiveRewardsWithdrawalEnabled: boolean,
      pendingTransactions: ExtractSuccess<typeof pendingTransactionsR>,
      priceChange: ExtractSuccess<typeof priceChangeR>,
      rates: ExtractSuccess<typeof ratesR>
    ) => {
      const hasNonCustodialBalance = getHasNonCustodialBalance(addressData)
      const hasBuySellBalance = !!buySellBalance[coin]?.available

      return {
        accountBalances,
        activeRewardsEligible,
        activeRewardsRates,
        addressData,
        buySellBalance,
        currentPrice: Exchange.displayCoinToFiat({
          rates,
          toCurrency: walletCurrency,
          value: 1
        }),
        earnEDDStatus,
        hasBalance: hasNonCustodialBalance || hasBuySellBalance,
        isActiveRewardsWithdrawalEnabled,
        pendingTransactions,
        priceChange
      }
    }
  )(
    accountBalancesR,
    activeRewardsEligibleR,
    activeRewardsRatesR,
    addressDataR,
    buySellBalanceR,
    earnEDDStatusR,
    isActiveRewardsWithdrawalEnabledR,
    pendingTransactionsR,
    priceChangeR,
    ratesR
  )
}
