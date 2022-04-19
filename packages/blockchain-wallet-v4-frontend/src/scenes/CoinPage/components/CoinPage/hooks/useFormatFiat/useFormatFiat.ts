import { useMemo } from 'react'

import { fiatToString } from '@core/exchange/utils'

import { UseFormatFiatComponent } from './types'

export const useFormatFiat: UseFormatFiatComponent = ({ currency, value }) => {
  return useMemo(() => {
    return fiatToString({
      unit: currency,
      value
    })
  }, [value, currency])
}
