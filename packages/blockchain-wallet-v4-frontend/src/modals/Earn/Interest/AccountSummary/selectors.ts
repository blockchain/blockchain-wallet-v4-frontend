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
  const accountBalancesR = selectors.components.interest.getPassiveRewardsAccountBalance(state)
  const interestLimitsR = selectors.components.interest.getInterestLimits(state)
  const interestEligibleR = selectors.components.interest.getInterestEligible(state)
  const interestRatesR = selectors.components.interest.getInterestRates(state)
  const flagEDDInterestFileUpload = selectors.core.walletOptions
    .getEDDInterestFileUpload(state)
    .getOrElse(false)
  const buySellBalanceR = selectors.components.buySell.getBSBalances(state)
  const addressDataR = getAddressDataR(state, coin)

  return lift(
    (
      accountBalances: ExtractSuccess<typeof accountBalancesR>,
      addressData,
      buySellBalance: ExtractSuccess<typeof buySellBalanceR>,
      interestLimits: ExtractSuccess<typeof interestLimitsR>,
      interestRates: ExtractSuccess<typeof interestRatesR>,
      interestEligible: ExtractSuccess<typeof interestEligibleR>
    ) => {
      const hasNonCustodialBalance = getHasNonCustodialBalance(addressData)
      const hasBuySellBalance = !!buySellBalance[coin]?.available
      return {
        accountBalances,
        flagEDDInterestFileUpload,
        hasBalance: hasNonCustodialBalance || hasBuySellBalance,
        interestEligible,
        interestLimits,
        interestRates
      }
    }
  )(
    accountBalancesR,
    addressDataR,
    buySellBalanceR,
    interestLimitsR,
    interestRatesR,
    interestEligibleR
  )
}
