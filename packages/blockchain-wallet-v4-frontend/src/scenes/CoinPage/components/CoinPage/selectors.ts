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
  (currencyR, priceChangeR, coin, addressDataR, balanceDataR, ratesR) => {
    const currency = currencyR.getOrElse('USD')

    const transform = (priceChange, addressData, balanceData, rates) => ({
      addressData,
      balanceData,
      coin,
      priceChange,
      rates
    })

    return {
      currency,
      data: lift(transform)(priceChangeR, addressDataR, balanceDataR, ratesR)
    }
  }
)
