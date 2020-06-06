import { convertBaseToStandard } from 'data/components/exchange/services'
import { Exchange } from 'blockchain-wallet-v4/src'

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
      accountBalanceStandard: convertBaseToStandard(
        coin,
        accountBalances[coin].balance
      ),
      lockedCoin: convertBaseToStandard(coin, accountBalances[coin].locked),
      availToWithdrawFiat:
        Exchange.convertCoinToFiat(
          convertBaseToStandard(coin, accountBalances[coin].balance),
          coin,
          walletCurrency,
          rates
        ) -
        Exchange.convertCoinToFiat(
          convertBaseToStandard(coin, accountBalances[coin].locked),
          coin,
          walletCurrency,
          rates
        ),
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
