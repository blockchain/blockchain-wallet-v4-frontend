import { lift } from 'ramda'

import { selectors } from 'data'

export const getData = state => {
  const btcRateR = selectors.core.data.btc.getRates(state)
  const coin = selectors.components.interest.getCoinType(state)
  const accountBalancesR = selectors.components.interest.getInterestAccountBalance(
    state
  )
  const supportedCoinsR = selectors.core.walletOptions.getSupportedCoins(state)
  const walletCurrencyR = selectors.core.settings.getCurrency(state)
  const interestLimitsR = selectors.components.interest.getInterestLimits(state)

  return lift(
    (
      accountBalances,
      rates,
      supportedCoins,
      walletCurrency,
      interestLimits
    ) => ({
      accountBalances,
      availToWithdraw: interestLimits[coin].maxWithdrawalAmount / 100,
      coin,
      rates,
      supportedCoins,
      walletCurrency,
      interestLimits
    })
  )(
    accountBalancesR,
    btcRateR,
    supportedCoinsR,
    walletCurrencyR,
    interestLimitsR
  )
}
