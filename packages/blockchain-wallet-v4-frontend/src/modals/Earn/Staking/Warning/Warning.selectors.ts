import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

import { getAddressDataR, getHasNonCustodialBalance } from '../../Earn.utils'

export const getData = (state: RootState) => {
  const coin = selectors.components.interest.getCoinType(state)
  const stakingLimitsR = selectors.components.interest.getStakingLimits(state)
  const buySellBalanceR = selectors.components.buySell.getBSBalances(state)
  const addressDataR = getAddressDataR(state, coin)

  return lift(
    (
      addressData,
      buySellBalance: ExtractSuccess<typeof buySellBalanceR>,
      stakingLimits: ExtractSuccess<typeof stakingLimitsR>
    ) => {
      const hasNonCustodialBalance = getHasNonCustodialBalance(addressData)
      const hasBuySellBalance = !!buySellBalance[coin]?.available
      return {
        hasBalance: hasNonCustodialBalance || hasBuySellBalance,
        stakingLimits
      }
    }
  )(addressDataR, buySellBalanceR, stakingLimitsR)
}
