import { lift, map } from 'ramda'

import { createDeepEqualSelector } from '@core/utils'
import * as balanceSelectors from 'components/Balances/selectors'
import { selectors } from 'data'

import { CoinPageContainerProps } from './types'

export const getData = (state, ownProps: CoinPageContainerProps) => {
  const { coin } = ownProps
  let balanceDataR

  switch (coin) {
    case 'BTC':
      balanceDataR = balanceSelectors.getBtcBalance(state)
      break
    case 'BCH':
      balanceDataR = balanceSelectors.getBchBalance(state)
      break
    case 'ETH':
      balanceDataR = balanceSelectors.getEthBalance(state)
      break
    case 'XLM':
      balanceDataR = balanceSelectors.getXlmBalance(state)
      break
    case 'EUR':
    case 'GBP':
    case 'USD':
      balanceDataR = balanceSelectors.getFiatBalance(coin, state)
      break
    default:
      switch (true) {
        case selectors.core.data.coins.getErc20Coins().includes(coin):
          balanceDataR = balanceSelectors.getErc20Balance(coin)(state)
          break
        case selectors.core.data.coins.getCustodialCoins().includes(coin):
          balanceDataR = balanceSelectors.getCoinCustodialBalance(coin)(state)
          break
        default:
      }
  }

  return createDeepEqualSelector(
    [
      selectors.core.settings.getCurrency,
      selectors.core.data.misc.getPriceIndexSeries,
      (state, { coin }: CoinPageContainerProps) => coin,
      (state, { coin }) => selectors.core.data.misc.getRatesSelector(coin, state)
    ],
    (currencyR, priceIndexSeriesDataR, coin, ratesR) => {
      const currency = currencyR.getOrElse('USD')

      const transform = (priceIndexSeriesData, balanceData, rates) => ({
        balanceData,
        coin,
        data: map((d) => [d.timestamp * 1000, d.price], priceIndexSeriesData) as any,
        rates
      })

      return {
        currency,
        data: lift(transform)(priceIndexSeriesDataR, balanceDataR, ratesR)
      }
    }
  )
}
