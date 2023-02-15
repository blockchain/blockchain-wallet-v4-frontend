import { lift } from 'ramda'
import { bindActionCreators } from 'redux'

import { ExtractSuccess } from '@core/types'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'

import { getAddressDataR, getHasNonCustodialBalance } from '../../Earn.utils'

export const getActions = (dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  earnActions: bindActionCreators(actions.components.interest, dispatch)
})

export const getRemote = (state: RootState) => {
  const coin = selectors.components.interest.getCoinType(state)
  const buySellBalanceR = selectors.components.buySell.getBSBalances(state)
  const isActiveRewardsWithdrawalEnabledR =
    selectors.core.walletOptions.getActiveRewardsWithdrawalEnabled(state)
  const addressDataR = getAddressDataR(state, coin)

  return lift(
    (
      addressData,
      buySellBalance: ExtractSuccess<typeof buySellBalanceR>,
      isActiveRewardsWithdrawalEnabled: ExtractSuccess<typeof isActiveRewardsWithdrawalEnabledR>
    ) => {
      const hasNonCustodialBalance = getHasNonCustodialBalance(addressData)
      const hasBuySellBalance = !!buySellBalance[coin]?.available

      return {
        hasBalance: hasNonCustodialBalance || hasBuySellBalance,
        isActiveRewardsWithdrawalEnabled: isActiveRewardsWithdrawalEnabled as boolean
      }
    }
  )(addressDataR, buySellBalanceR, isActiveRewardsWithdrawalEnabledR)
}
