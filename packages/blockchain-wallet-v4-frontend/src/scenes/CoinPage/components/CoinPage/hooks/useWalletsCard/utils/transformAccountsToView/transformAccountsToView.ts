import { convertCoinToFiat } from '@core/exchange'
import { coinToString, fiatToString } from '@core/exchange/utils'
import { convertBaseToStandard } from 'data/components/exchange/services'

import { TransformAccountsToViewUtil } from './transformAccountsToView.types'

export const transformToAccounts: TransformAccountsToViewUtil = ({
  coin,
  currency,
  rates,
  value
}) => {
  const totalFiatAmount = convertCoinToFiat({
    coin,
    currency,
    isStandard: false,
    rates,
    value
  })

  const totalFiat = fiatToString({
    unit: currency,
    value: totalFiatAmount
  })

  const totalCrypto = coinToString({
    unit: { symbol: coin },
    value: convertBaseToStandard(coin, value)
  })

  return {
    totalCrypto,
    totalFiat
  }
}
