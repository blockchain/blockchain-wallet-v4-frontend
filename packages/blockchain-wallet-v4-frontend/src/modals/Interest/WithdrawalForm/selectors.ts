import { lift } from 'ramda'
import { selectors } from 'data'
import BigNumber from 'bignumber.js'

export const getData = state => {
  const coin = selectors.components.interest.getCoinType(state)
  const displayCoin = selectors.components.interest.getCoinDisplay(state)
  const accountBalancesR = selectors.components.interest.getInterestAccountBalance(
    state
  )
  const ratesR = selectors.components.interest.getRates(state)
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
      availToWithdraw: new BigNumber(
        Number(accountBalances[coin].balance)
      ).minus(accountBalances[coin].locked),
      coin,
      displayCoin,
      rates,
      supportedCoins,
      walletCurrency,
      interestLimits
    })
  )(accountBalancesR, ratesR, supportedCoinsR, walletCurrencyR, interestLimitsR)
}
