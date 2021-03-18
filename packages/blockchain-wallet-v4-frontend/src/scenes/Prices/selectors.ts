import { lift, map, not, reject, values } from 'ramda'

import {
  CoinTypeEnum,
  ExtractSuccess,
  SupportedCoinType
} from 'blockchain-wallet-v4/src/types'
import { getAllCoinsBalancesSelector } from 'components/Balances/selectors'
import { selectors } from 'data'

export const getData = state => {
  const coinRates = selectors.core.data.misc.getAllCoinRatesSelector(state)
  const supportedCoinsR = selectors.core.walletOptions.getSupportedCoins(state)
  // const walletCurrencyR = selectors.core.settings.getCurrency(state)
  const coinBalances = getAllCoinsBalancesSelector(state)

  const transform = (
    supportedCoins: ExtractSuccess<typeof supportedCoinsR>
    // walletCurrency:  ExtractSuccess<typeof walletCurrencyR>
  ) => {
    // logic to exclude fiat currencies from list
    return reject(
      not,
      values(
        // @ts-ignore
        map(
          (coin: SupportedCoinType) =>
            coin.coinCode in CoinTypeEnum && {
              coin: coin.coinCode,
              coinModel: coin,
              name: `${coin.displayName} (${coin.coinTicker})`,
              price: coinRates[coin.coinCode],
              priceChange: '2.4',
              balance: coinBalances[coin.coinCode]
            },
          supportedCoins
        )
      )
    )
  }

  return lift(transform)(supportedCoinsR)
}
