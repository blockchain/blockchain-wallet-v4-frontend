import BigNumber from 'bignumber.js'
import { lift } from 'ramda'

import { selectors } from 'data'

export const getData = state => {
  const coin = selectors.components.interest.getCoinType(state)
  const displayCoin = selectors.components.interest.getCoinDisplay(state)
  const accountBalancesR = selectors.components.interest.getInterestAccountBalance(
    state
  )
  const ratesR = selectors.components.interest.getRates(state)
  const supportedCoinsR = selectors.core.walletOptions.getSupportedCoins(state)
  const walletCurrencyR = selectors.core.settings.getCurrency(state)
  const withdrawalMinimumsR = selectors.components.interest.getWithdrawalMinimums(
    state
  )
  const interestLimitsR = selectors.components.interest.getInterestLimits(state)

  return lift(
    (
      accountBalances,
      interestLimits,
      rates,
      supportedCoins,
      walletCurrency,
      withdrawalMinimums
    ) => ({
      accountBalances,
      availToWithdraw: new BigNumber(
        Number(accountBalances[coin].balance)
      ).minus(accountBalances[coin].locked),
      coin,
      displayCoin,
      interestLimits,
      rates,
      supportedCoins,
      walletCurrency,
      withdrawalMinimums
    })
  )(
    accountBalancesR,
    interestLimitsR,
    ratesR,
    supportedCoinsR,
    walletCurrencyR,
    withdrawalMinimumsR
  )
}
