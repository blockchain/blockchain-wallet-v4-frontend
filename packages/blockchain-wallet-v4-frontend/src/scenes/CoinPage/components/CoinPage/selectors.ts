import { lift, map } from 'ramda'

import { TimeRange } from '@core/types'
import { createDeepEqualSelector } from '@core/utils'
import * as balanceSelectors from 'components/Balances/selectors'
import { getData as getBtcAddressData } from 'components/Form/SelectBoxBtcAddresses/selectors'
import { selectors } from 'data'

import { CoinPageContainerProps } from './types'

export const getData = createDeepEqualSelector(
  [
    selectors.core.settings.getCurrency,
    selectors.core.data.misc.getPriceIndexSeries,
    (state, { coin }: CoinPageContainerProps) =>
      selectors.core.data.misc.getPriceChange(coin, TimeRange.WEEK, state),
    (state, { coin }) => coin,
    (state) =>
      getBtcAddressData(state, {
        excludeLockbox: true,
        includeAll: false,
        includeCustodial: true,
        includeInterest: true
      }),
    balanceSelectors.getBtcBalance,
    (state, { coin }) => selectors.core.data.misc.getRatesSelector(coin, state)
  ],
  (currencyR, priceIndexSeriesDataR, priceChangeR, coin, addressDataR, balanceDataR, ratesR) => {
    const currency = currencyR.getOrElse('USD')

    const transform = (priceIndexSeriesData, priceChange, addressData, balanceData, rates) => ({
      addressData,
      balanceData,
      coin,
      data: map((d) => [d.timestamp * 1000, d.price], priceIndexSeriesData) as any,
      priceChange,
      rates
    })

    return {
      currency,
      data: lift(transform)(priceIndexSeriesDataR, priceChangeR, addressDataR, balanceDataR, ratesR)
    }
  }
)
