import { lift } from 'ramda'

import {
  ExtractSuccess,
  FiatType,
  SupportedWalletCurrenciesType
} from 'core/types'
import { selectors } from 'data'

export const getData = state => {
  const accountBalancesR = selectors.components.interest.getInterestAccountBalance(
    state
  )
  const interestLimitsR = selectors.components.interest.getInterestLimits(state)
  const interestRateR = selectors.components.interest.getInterestRate(state)
  const supportedCoinsR = selectors.core.walletOptions.getSupportedCoins(state)
  const walletCurrencyR = selectors.core.settings.getCurrency(state)

  return lift(
    (
      accountBalances: ExtractSuccess<typeof accountBalancesR>,
      interestLimits: ExtractSuccess<typeof interestLimitsR>,
      interestRate: ExtractSuccess<typeof interestRateR>,
      supportedCoins: SupportedWalletCurrenciesType,
      walletCurrency: FiatType
    ) => ({
      accountBalances,
      interestLimits,
      interestRate,
      supportedCoins,
      walletCurrency
    })
  )(
    accountBalancesR,
    interestLimitsR,
    interestRateR,
    supportedCoinsR,
    walletCurrencyR
  )
}
