import { convertCoinToFiat } from '@core/exchange'
import { coinToString, fiatToString } from '@core/exchange/utils'
import { CoinType, FiatType, RatesType } from '@core/types'
import { convertBaseToStandard } from 'data/components/exchange/services'

export const formatValues = (
  coin: CoinType,
  available: number | undefined,
  balance: number | undefined,
  rates: RatesType,
  currency: FiatType
) => {
  const totalFiatAmount = convertCoinToFiat({
    coin,
    currency,
    isStandard: false,
    rates,
    value: available ?? balance ?? 0
  })
  const totalFiatFormatted = fiatToString({
    unit: currency,
    value: totalFiatAmount
  })
  const totalCryptoFormatted = coinToString({
    unit: { symbol: coin },
    value: convertBaseToStandard(coin, available ?? balance ?? 0)
  })

  return [totalCryptoFormatted, totalFiatFormatted]
}
